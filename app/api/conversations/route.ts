import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { consumeRateLimit } from "@/lib/rate-limit"

function orderedPair(userA: string, userB: string) {
  return userA < userB ? [userA, userB] : [userB, userA]
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

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  const userId = session.user.id
  try {
    const rateLimit = await consumeRateLimit("conversations:list", userId, 120, 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many conversation refreshes. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Messaging is temporarily unavailable." }, { status: 503 })
  }

  const conversations = await db.conversation.findMany({
    where: { OR: [{ participantAId: userId }, { participantBId: userId }] },
    orderBy: { updatedAt: "desc" },
    include: {
      participantA: { select: { id: true, name: true, image: true } },
      participantB: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, content: true, senderId: true, createdAt: true, readAt: true },
      },
    },
  })

  // Do not leak cached last-message content for conversations whose
  // underlying connection has since been blocked or removed.
  const otherUserIds = conversations.map((conversation) =>
    conversation.participantAId === userId
      ? conversation.participantBId
      : conversation.participantAId,
  )
  const activeConnections = await db.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: userId, recipientId: { in: otherUserIds } },
        { requesterId: { in: otherUserIds }, recipientId: userId },
      ],
    },
    select: { requesterId: true, recipientId: true },
  })
  const activeUserIds = new Set(
    activeConnections.map((connection) =>
      connection.requesterId === userId ? connection.recipientId : connection.requesterId,
    ),
  )

  return Response.json({
    conversations: conversations
      .filter((conversation) => {
        const otherId =
          conversation.participantAId === userId
            ? conversation.participantBId
            : conversation.participantAId
        return activeUserIds.has(otherId)
      })
      .map((conversation) => {
        const user =
          conversation.participantAId === userId
            ? conversation.participantB
            : conversation.participantA
        return {
          id: conversation.id,
          updatedAt: conversation.updatedAt,
          user,
          lastMessage: conversation.messages[0] ?? null,
        }
      }),
  }, { headers: { "Cache-Control": "private, no-store" } })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const rateLimit = await consumeRateLimit("conversations:create", session.user.id, 20, 60 * 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many new conversations. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Messaging is temporarily unavailable." }, { status: 503 })
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

  const participantId =
    typeof body === "object" && body !== null && "participantId" in body &&
    typeof body.participantId === "string" ? body.participantId.trim() : ""

  if (!participantId) return Response.json({ error: "A participant is required." }, { status: 400 })
  if (participantId === session.user.id) return Response.json({ error: "You cannot message yourself." }, { status: 400 })

  if (!(await areConnected(session.user.id, participantId))) {
    return Response.json({ error: "You can only message an accepted connection." }, { status: 403 })
  }

  const participant = await db.user.findUnique({
    where: { id: participantId },
    select: { id: true, role: true },
  })
  if (!participant || participant.role !== "STUDENT") {
    return Response.json({ error: "Student not found." }, { status: 404 })
  }

  const [participantAId, participantBId] = orderedPair(session.user.id, participantId)
  const conversation = await db.conversation.upsert({
    where: { participantAId_participantBId: { participantAId, participantBId } },
    create: { participantAId, participantBId },
    update: {},
  })

  return Response.json({ conversation }, { status: 200 })
}
