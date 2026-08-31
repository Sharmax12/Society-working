"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitApplication(societyId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const studentId = session.user.id

  const society = await db.society.findUnique({
    where: { id: societyId },
    include: { questions: true },
  })

  if (!society) throw new Error("Society not found")
  if (!society.isOpen || society.deadline < new Date()) {
    throw new Error("Applications for this society are closed")
  }

  const existing = await db.application.findUnique({
    where: { studentId_societyId: { studentId, societyId } },
  })
  if (existing) throw new Error("You've already applied to this society")

  const rollNumber = formData.get("rollNumber") as string
  const phone = formData.get("phone") as string

  // Keep the student's profile info up to date
  await db.user.update({
    where: { id: studentId },
    data: {
      rollNumber: rollNumber || undefined,
      phone: phone || undefined,
    },
  })

  const answers = society.questions.map((q) => ({
    questionId: q.id,
    response: (formData.get(`question-${q.id}`) as string) ?? "",
  }))

  // Validate required questions were answered
  for (const q of society.questions) {
    if (q.required) {
      const answer = formData.get(`question-${q.id}`) as string
      if (!answer?.trim()) {
        throw new Error(`Please answer: "${q.prompt}"`)
      }
    }
  }

  await db.application.create({
    data: {
      studentId,
      societyId,
      answers: { create: answers },
    },
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { society: true },
  })

  if (!application || application.society.adminId !== session.user.id) {
    throw new Error("Not authorized to update this application")
  }

  await db.application.update({
    where: { id: applicationId },
    data: { status },
  })

  revalidatePath(`/admin/societies/${application.societyId}`)
}