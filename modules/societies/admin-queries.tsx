import { db } from "@/lib/db"

export async function getManagedSocieties(adminId: string) {
  const societies = await db.society.findMany({
    where: { adminId },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return societies
}

export async function getSocietyApplications(societyId: string, adminId: string) {
  const society = await db.society.findFirst({
    where: { id: societyId, adminId },
    include: { questions: true },
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