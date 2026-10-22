import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { consumeRateLimit } from "@/lib/rate-limit"

function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 128
}

function connectionPairKey(userA: string, userB: string): string {
  return userA < userB ? `${userA}:${userB}` : `${userB}:${userA}`
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const userId = session.user.id

  const connections = await db.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      requester: {
        select: { id: true, name: true, image: true },
      },
      recipient: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  return Response.json({
    connections: connections.map((connection) => ({
      id: connection.id,
      connectedAt: connection.updatedAt,
      user:
        connection.requesterId === userId
          ? connection.recipient
          : connection.requester,
    })),
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const rateLimit = await consumeRateLimit("connections:create", session.user.id, 20, 60 * 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many connection requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Connection requests are temporarily unavailable." }, { status: 503 })
  }

  let body: unknown
  try {
    body = await readJsonBody(request, 4 * 1024)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Request body is too large." }, { status: 413 })
    }
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const recipientId =
    typeof body === "object" &&
    body !== null &&
    "recipientId" in body &&
    isValidId(body.recipientId)
      ? body.recipientId.trim()
      : ""

  if (!recipientId) {
    return Response.json({ error: "A recipient is required." }, { status: 400 })
  }

  const requesterId = session.user.id

  if (requesterId === recipientId) {
    return Response.json({ error: "You cannot connect with yourself." }, { status: 400 })
  }

  const recipient = await db.user.findUnique({
    where: { id: recipientId },
    select: { id: true, role: true },
  })

  if (!recipient || recipient.role !== "STUDENT") {
    return Response.json({ error: "That student could not be found." }, { status: 404 })
  }

  const existing = await db.connection.findFirst({
    where: {
      OR: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId },
      ],
    },
  })

  if (existing) {
    if (existing.status === "ACCEPTED") {
      return Response.json({ error: "You are already connected." }, { status: 409 })
    }

    if (existing.status === "PENDING") {
      return Response.json(
        {
          error:
            existing.requesterId === requesterId
              ? "Connection request already sent."
              : "This student has already sent you a request.",
        },
        { status: 409 },
      )
    }

    if (existing.status === "BLOCKED") {
      return Response.json({ error: "This connection is unavailable." }, { status: 403 })
    }

    if (existing.requesterId === requesterId) {
      // Resending a rejected request must not overwrite a block applied after
      // the initial read. Include current status and owner in the write filter.
      const result = await db.connection.updateMany({
        where: {
          id: existing.id,
          requesterId,
          recipientId,
          status: "REJECTED",
        },
        data: { status: "PENDING" },
      })
      if (result.count !== 1) {
        return Response.json(
          { error: "This connection changed. Refresh and try again." },
          { status: 409 },
        )
      }
      const connection = await db.connection.findUnique({
        where: { id: existing.id },
        select: { id: true, requesterId: true, recipientId: true, status: true, createdAt: true, updatedAt: true },
      })
      return Response.json({ connection }, { status: 201 })
    }

    // Only remove the reverse rejected row if it is still rejected. Otherwise
    // a simultaneous block could be deleted by a stale connection request.
    const deleted = await db.connection.deleteMany({
      where: {
        id: existing.id,
        requesterId: recipientId,
        recipientId: requesterId,
        status: "REJECTED",
      },
    })
    if (deleted.count !== 1) {
      return Response.json(
        { error: "This connection changed. Refresh and try again." },
        { status: 409 },
      )
    }
  }

  try {
    const connection = await db.connection.create({
      data: {
        requesterId,
        recipientId,
        pairKey: connectionPairKey(requesterId, recipientId),
        status: "PENDING",
      },
      select: {
        id: true,
        requesterId: true,
        recipientId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return Response.json({ connection }, { status: 201 })
  } catch (error) {
    // The canonical unique pair key is the database-level race guard. A
    // simultaneous request in the opposite direction becomes a conflict,
    // not a duplicate edge or an opaque server error.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "A connection request for this student already exists. Refresh and try again." },
        { status: 409 },
      )
    }
    console.error("Connection request failed:", error)
    return Response.json({ error: "Unable to send the connection request." }, { status: 500 })
  }
}
