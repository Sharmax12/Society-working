import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

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

export async function requireSocietyAdminSession() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const hasGlobalAdminAccess = session.user.role === "ADMIN"
  const hasTenantAccess = await hasSocietyAdminAccess(session.user.id)

  if (!hasGlobalAdminAccess && !hasTenantAccess) {
    redirect("/dashboard")
  }

  return session
}

export async function canManageSociety(
  societyId: string,
  userId: string
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
