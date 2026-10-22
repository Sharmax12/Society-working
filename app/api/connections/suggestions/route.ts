import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const userId = session.user.id

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
