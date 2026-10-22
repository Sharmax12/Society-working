import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http"
import { auth } from "@/auth"
import { db } from "@/lib/db"

type RouteContext = {
  params: Promise<{ connectionId: string }>
}

const privateHeaders = { "Cache-Control": "private, no-store" }

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401, headers: privateHeaders })
  }

  const { connectionId } = await context.params

  let body: unknown
  try {
    body = await readJsonBody(request, 4 * 1024)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Request body is too large." }, { status: 413, headers: privateHeaders })
    }
    return Response.json({ error: "Invalid request." }, { status: 400, headers: privateHeaders })
  }

  const action =
    typeof body === "object" &&
    body !== null &&
    !Array.isArray(body) &&
    "action" in body &&
    typeof body.action === "string"
      ? body.action
      : ""

  if (!["accept", "reject", "block"].includes(action)) {
    return Response.json({ error: "Invalid connection action." }, { status: 400, headers: privateHeaders })
  }

  const connection = await db.connection.findUnique({ where: { id: connectionId } })
  if (!connection) {
    return Response.json({ error: "Connection not found." }, { status: 404, headers: privateHeaders })
  }

  const userId = session.user.id

  if (action === "accept" || action === "reject") {
    if (connection.recipientId !== userId || connection.status !== "PENDING") {
      return Response.json({ error: "You cannot perform this action." }, { status: 403, headers: privateHeaders })
    }

    // Include ownership and current state in the mutation to prevent a stale
    // read from allowing two competing accept/reject actions to overwrite each other.
    const result = await db.connection.updateMany({
      where: { id: connectionId, recipientId: userId, status: "PENDING" },
      data: { status: action === "accept" ? "ACCEPTED" : "REJECTED" },
    })
    if (result.count !== 1) {
      return Response.json({ error: "This connection request has already changed." }, { status: 409, headers: privateHeaders })
    }

    const updated = await db.connection.findUnique({ where: { id: connectionId } })
    return Response.json({ connection: updated }, { headers: privateHeaders })
  }

  if (connection.requesterId !== userId && connection.recipientId !== userId) {
    return Response.json({ error: "You cannot perform this action." }, { status: 403, headers: privateHeaders })
  }

  // Keep the participant check inside the write as well as above, so a
  // concurrent delete cannot turn this into an unscoped mutation.
  const result = await db.connection.updateMany({
    where: {
      id: connectionId,
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    data: { status: "BLOCKED", blockedById: userId },
  })
  if (result.count !== 1) {
    return Response.json({ error: "This connection has changed. Refresh and try again." }, { status: 409, headers: privateHeaders })
  }

  const updated = await db.connection.findUnique({ where: { id: connectionId } })
  return Response.json({ connection: updated }, { headers: privateHeaders })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401, headers: privateHeaders })
  }

  const { connectionId } = await context.params
  const userId = session.user.id

  // Apply membership and blocker ownership atomically to avoid a read/write race
  // where another user blocks the connection between the initial read and delete.
  const result = await db.connection.deleteMany({
    where: {
      id: connectionId,
      AND: [
        { OR: [{ requesterId: userId }, { recipientId: userId }] },
        {
          OR: [
            { status: { not: "BLOCKED" } },
            { blockedById: null },
            { blockedById: userId },
          ],
        },
      ],
    },
  })

  if (result.count !== 1) {
    const connection = await db.connection.findUnique({
      where: { id: connectionId },
      select: { requesterId: true, recipientId: true, status: true, blockedById: true },
    })
    if (!connection) {
      return Response.json({ error: "Connection not found." }, { status: 404, headers: privateHeaders })
    }
    if (connection.requesterId !== userId && connection.recipientId !== userId) {
      return Response.json({ error: "You cannot remove this connection." }, { status: 403, headers: privateHeaders })
    }
    if (connection.status === "BLOCKED" && connection.blockedById !== null && connection.blockedById !== userId) {
      return Response.json({ error: "Only the person who blocked this connection can unblock it." }, { status: 403, headers: privateHeaders })
    }
    return Response.json({ error: "This connection has changed. Refresh and try again." }, { status: 409, headers: privateHeaders })
  }

  return Response.json({ success: true }, { headers: privateHeaders })
}
