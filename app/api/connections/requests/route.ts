import { auth } from "@/auth"
import { db } from "@/lib/db"
import { consumeRateLimit } from "@/lib/rate-limit"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const rateLimit = await consumeRateLimit("connections:requests:list", session.user.id, 120, 60)
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many request refreshes. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      )
    }
  } catch {
    return Response.json({ error: "Connection requests are temporarily unavailable." }, { status: 503 })
  }

  const requests = await db.connection.findMany({
    where: {
      recipientId: session.user.id,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    include: {
      requester: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  return Response.json({
    requests: requests.map((request) => ({
      id: request.id,
      createdAt: request.createdAt,
      user: request.requester,
    })),
  })
}
