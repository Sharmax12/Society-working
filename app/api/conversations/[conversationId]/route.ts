import { auth } from "@/auth"
import { db } from "@/lib/db"

type RouteContext = {
  params: Promise<{ conversationId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

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

  const user =
    conversation.participantAId === session.user.id
      ? conversation.participantB
      : conversation.participantA

  return Response.json({ conversation: { id: conversation.id, user } })
}
