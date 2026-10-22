import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http"
import { auth } from "@/auth"
import { db } from "@/lib/db"

function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
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
      const connection = await db.connection.update({
        where: { id: existing.id },
        data: { status: "PENDING" },
      })
      return Response.json({ connection }, { status: 201 })
    }

    await db.connection.delete({ where: { id: existing.id } })
  }

  try {
    const connection = await db.connection.create({
      data: {
        requesterId,
        recipientId,
        status: "PENDING",
      },
    })

    return Response.json({ connection }, { status: 201 })
  } catch (error) {
    console.error("Connection request failed:", error)
    return Response.json({ error: "Unable to send the connection request." }, { status: 500 })
  }
}
