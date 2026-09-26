import { db } from "@/lib/db"

export async function hasSocietyAdminAccess(userId: string) {
  const society = await db.society.findFirst({
    where: {
      OR: [
        { adminId: userId },
        { admins: { some: { userId } } },
      ],
    },
    select: { id: true },
  })

  return Boolean(society)
}
