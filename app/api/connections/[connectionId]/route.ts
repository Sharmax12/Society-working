import { auth } from "@/auth"
import { db } from "@/lib/db"

type RouteContext = {
  params: Promise<{ connectionId: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { connectionId } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const action =
    typeof body === "object" &&
    body !== null &&
    "action" in body &&
    typeof body.action === "string"
      ? body.action
      : ""

  if (!["accept", "reject", "block"].includes(action)) {
    return Response.json({ error: "Invalid connection action." }, { status: 400 })
  }

  const connection = await db.connection.findUnique({
    where: { id: connectionId },
  })

  if (!connection) {
    return Response.json({ error: "Connection not found." }, { status: 404 })
  }

  const userId = session.user.id

  if (action === "accept" || action === "reject") {
    if (connection.recipientId !== userId || connection.status !== "PENDING") {
      return Response.json({ error: "You cannot perform this action." }, { status: 403 })
    }

    const updated = await db.connection.update({
      where: { id: connectionId },
      data: { status: action === "accept" ? "ACCEPTED" : "REJECTED" },
    })

    return Response.json({ connection: updated })
  }

  if (connection.requesterId !== userId && connection.recipientId !== userId) {
    return Response.json({ error: "You cannot perform this action." }, { status: 403 })
  }

  const updated = await db.connection.update({
    where: { id: connectionId },
    data: { status: "BLOCKED", blockedById: userId },
  })

  return Response.json({ connection: updated })
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { connectionId } = await context.params

  const connection = await db.connection.findUnique({
    where: { id: connectionId },
    select: { id: true, requesterId: true, recipientId: true, status: true, blockedById: true },
  })

  if (!connection) {
    return Response.json({ error: "Connection not found." }, { status: 404 })
  }

  if (
    connection.requesterId !== session.user.id &&
    connection.recipientId !== session.user.id
  ) {
    return Response.json({ error: "You cannot remove this connection." }, { status: 403 })
  }

  // On newly blocked edges only the user who created the block may undo it.
  // Legacy blocked rows have blockedById=null and remain removable by either
  // participant so an old block cannot become permanent after this migration.
  if (
    connection.status === "BLOCKED" &&
    connection.blockedById !== null &&
    connection.blockedById !== session.user.id
  ) {
    return Response.json({ error: "Only the person who blocked this connection can unblock it." }, { status: 403 })
  }

  await db.connection.delete({ where: { id: connectionId } })

  return Response.json({ success: true })
}
