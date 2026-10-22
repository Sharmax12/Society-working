import { auth } from "@/auth"
import { db } from "@/lib/db"
import { consumeRateLimit } from "@/lib/rate-limit"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const userId = session.user.id
  try {
    const rateLimit = await consumeRateLimit("connections:suggestions:list", userId, 60, 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many suggestion refreshes. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Suggestions are temporarily unavailable." }, { status: 503 })
  }

  const existingConnections = await db.connection.findMany({
    where: {
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    select: {
      requesterId: true,
      recipientId: true,
    },
  })

  const excludedIds = new Set<string>([userId])
  for (const connection of existingConnections) {
    excludedIds.add(connection.requesterId)
    excludedIds.add(connection.recipientId)
  }

  const suggestions = await db.user.findMany({
    where: {
      role: "STUDENT",
      id: { notIn: Array.from(excludedIds) },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  return Response.json({ suggestions })
}
