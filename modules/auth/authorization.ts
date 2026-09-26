import type { Role } from "@prisma/client"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function requireAdminSession() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")
  return session
}

export function isSuperAdmin(role: Role) {
  return role === "SUPER_ADMIN"
}

export async function canManageSociety(
  societyId: string,
  userId: string,
  role: Role
) {
  if (role === "SUPER_ADMIN") return true

  if (role !== "ADMIN") return false

  const society = await db.society.findFirst({
    where: {
      id: societyId,
      OR: [
        { adminId: userId },
        { admins: { some: { userId } } },
      ],
    },
    select: { id: true },
  })

  return Boolean(society)
}
