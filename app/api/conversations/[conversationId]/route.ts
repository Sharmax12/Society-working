import { auth } from "@/auth"
import { db } from "@/lib/db"
import { consumeRateLimit } from "@/lib/rate-limit"

type RouteContext = {
  params: Promise<{ conversationId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const rateLimit = await consumeRateLimit("conversations:read", session.user.id, 300, 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many chat refreshes. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Messaging is temporarily unavailable." }, { status: 503 })
  }

  const { conversationId } = await context.params
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ participantAId: session.user.id }, { participantBId: session.user.id }],
    },
    include: {
      participantA: { select: { id: true, name: true, image: true } },
      participantB: { select: { id: true, name: true, image: true } },
    },
  })

  if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 })

  const otherUserId =
    conversation.participantAId === session.user.id
      ? conversation.participantBId
      : conversation.participantAId
  const acceptedConnection = await db.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: session.user.id, recipientId: otherUserId },
        { requesterId: otherUserId, recipientId: session.user.id },
      ],
    },
    select: { id: true },
  })
  if (!acceptedConnection) {
    return Response.json({ error: "Chat is unavailable because this connection is no longer active." }, { status: 403 })
  }

  const user =
    conversation.participantAId === session.user.id
      ? conversation.participantB
      : conversation.participantA

  return Response.json({ conversation: { id: conversation.id, user } })
}
