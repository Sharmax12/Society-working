import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http"
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

  const userId = session.user.id
  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, userId)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      content: true,
      senderId: true,
      createdAt: true,
      readAt: true,
    },
  })

  // Return the newest 100 messages, but keep the UI's chronological display order.
  return Response.json({ messages: messages.reverse() }, {
    headers: { "Cache-Control": "private, no-store" },
  })
}

export async function POST(request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  const userId = session.user.id
  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, userId)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  const otherUserId =
    conversation.participantAId === userId ? conversation.participantBId : conversation.participantAId

  if (!(await areConnected(userId, otherUserId))) {
    return Response.json({ error: "Messaging is only available to accepted connections." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await readJsonBody(request, 8 * 1024)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Request body is too large." }, { status: 413 })
    }
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const content =
    typeof body === "object" && body !== null && "content" in body &&
    typeof body.content === "string" ? body.content.trim() : ""

  if (!content) return Response.json({ error: "Message cannot be empty." }, { status: 400 })
  if (content.length > 2000) return Response.json({ error: "Message is too long." }, { status: 400 })

  const message = await db.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: { conversationId, senderId: userId, content },
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

  const userId = session.user.id
  const { conversationId } = await context.params
  const conversation = await getConversationForUser(conversationId, userId)
  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: { readAt: new Date() },
  })

  return Response.json({ success: true })
}
