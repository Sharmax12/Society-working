import { auth } from "@/auth"
import { db } from "@/lib/db"

type RouteContext = {
  params: Promise<{ conversationId: string }>
}

async function getConversationForUser(conversationId: string, userId: string) {
  return db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ participantAId: userId }, { participantBId: userId }],
    },
    select: {
      id: true,
      participantAId: true,
      participantBId: true,
    },
  })
}

async function areConnected(userId: string, otherUserId: string) {
  const connection = await db.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: userId, recipientId: otherUserId },
        { requesterId: otherUserId, recipientId: userId },
      ],
    },
    select: { id: true },
  })
  return Boolean(connection)
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, session.user.id)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 100,
    select: {
      id: true,
      content: true,
      senderId: true,
      createdAt: true,
      readAt: true,
    },
  })

  return Response.json({ messages })
}

export async function POST(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, session.user.id)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  const otherUserId =
    conversation.participantAId === session.user.id
      ? conversation.participantBId
      : conversation.participantAId

  if (!(await areConnected(session.user.id, otherUserId))) {
    return Response.json({ error: "Messaging is only available to accepted connections." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const content =
    typeof body === "object" && body !== null && "content" in body &&
    typeof body.content === "string" ? body.content.trim() : ""

  if (!content) return Response.json({ error: "Message cannot be empty." }, { status: 400 })
  if (content.length > 2000) return Response.json({ error: "Message is too long." }, { status: 400 })

  const message = await db.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: { conversationId, senderId: session.user.id, content },
      select: { id: true, content: true, senderId: true, createdAt: true, readAt: true },
    })
    await tx.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })
    return created
  })

  return Response.json({ message }, { status: 201 })
}

export async function PATCH(_request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, session.user.id)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  })

  return Response.json({ success: true })
}
