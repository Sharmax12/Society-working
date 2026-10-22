import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
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
