import type { Role } from "@prisma/client"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function requireAdminSession() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const managedSociety = await db.society.findFirst({
    where: {
      OR: [
        { adminId: session.user.id },
        { admins: { some: { userId: session.user.id } } },
      ],
    },
    select: { id: true },
  })

  if (session.user.role !== "ADMIN" && !managedSociety) redirect("/dashboard")
  return session
}

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

export function isSuperAdmin(role: Role) {
  return role === "SUPER_ADMIN"
}

export async function canManageSociety(
  societyId: string,
  userId: string,
  _role: Role
) {
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
