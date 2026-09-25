import { db } from "@/lib/db"
import { canManageSociety } from "@/modules/auth/authorization"

function managedSocietyWhere(userId: string) {
  return {
    OR: [
      { adminId: userId },
      { admins: { some: { userId } } },
    ],
  } as const
}

export async function getManagedSociety(societyId: string, adminId: string) {
  return db.society.findFirst({
    where: { id: societyId, ...managedSocietyWhere(adminId) },
  })
}

export async function getManagedSocieties(adminId: string) {
  return db.society.findMany({
    where: managedSocietyWhere(adminId),
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSocietyApplications(societyId: string, adminId: string) {
  const society = await db.society.findFirst({
    where: { id: societyId, ...managedSocietyWhere(adminId) },
    include: {
      questions: true,
      admins: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!society) return null

  const applications = await db.application.findMany({
    where: { societyId },
    include: {
      student: true,
      answers: { include: { question: true } },
    },
    orderBy: { submittedAt: "asc" },
  })

  return { society, applications }
}

export async function addSocietyAdmin(
  societyId: string,
  email: string,
  actingAdminId: string
) {
  const society = await getManagedSociety(societyId, actingAdminId)
  if (!society) throw new Error("You don't manage this society")

  const user = await db.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, role: true },
  })

  if (!user || user.role !== "ADMIN") {
    throw new Error("The user must already have an Admin account")
  }

  await db.societyAdmin.upsert({
    where: {
      societyId_userId: { societyId, userId: user.id },
    },
    create: { societyId, userId: user.id },
    update: {},
  })
}

export async function removeSocietyAdmin(
  societyId: string,
  userId: string,
  actingAdminId: string
) {
  const society = await getManagedSociety(societyId, actingAdminId)
  if (!society) throw new Error("You don't manage this society")

  if (society.adminId === userId) {
    throw new Error("The primary society owner cannot be removed")
  }

  await db.societyAdmin.deleteMany({
    where: { societyId, userId },
  })
}
