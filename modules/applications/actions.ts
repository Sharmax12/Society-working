"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import {
  sendApplicationAcceptedEmail,
  sendApplicationReceivedEmail,
  sendInterviewInvitationEmail,
} from "@/lib/email"
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
  if (society.verificationStatus !== "VERIFIED" || !society.isOpen || society.deadline < new Date()) {
    throw new Error("Applications for this society are closed")
  }

  const existing = await db.application.findUnique({
    where: { studentId_societyId: { studentId, societyId } },
  })
  if (existing) throw new Error("You've already applied to this society")

  const student = await db.user.findUnique({
    where: { id: studentId },
    select: { name: true, email: true },
  })

  if (!student) throw new Error("Student account not found")

  const rollNumber = String(formData.get("rollNumber") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()

  if (!rollNumber) throw new Error("Roll number is required")
  if (!phone) throw new Error("Phone number is required")

  await db.user.update({
    where: { id: studentId },
    data: {
      rollNumber,
      phone,
    },
  })

  const answers = society.questions.map((q) => ({
    questionId: q.id,
    name: q.prompt,
    response: (formData.get(`question-${q.id}`) as string) ?? "",
  }))

  for (const q of society.questions) {
    if (q.required) {
      const answer = formData.get(`question-${q.id}`) as string
      if (!answer?.trim()) {
        throw new Error(`Please answer: "${q.prompt}"`)
      }
    }
  }

  const application = await db.application.create({
    data: {
      name: student.name,
      studentId,
      societyId,
      answers: { create: answers },
    },
    include: { society: { select: { name: true } } },
  })

  await sendApplicationReceivedEmail({
    applicationId: application.id,
    applicantName: student.name,
    applicantEmail: student.email,
    societyName: application.society.name,
  })

  revalidatePath("/dashboard")
  redirect(`/apply/${societyId}/submitted`)
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      society: true,
      student: { select: { name: true, email: true } },
    },
  })

  if (
    !application ||
    !(
      application.society.adminId === session.user.id ||
      (await db.societyAdmin.findUnique({
        where: {
          societyId_userId: {
            societyId: application.societyId,
            userId: session.user.id,
          },
        },
      }))
    )
  ) {
    throw new Error("Not authorized to update this application")
  }

  const previousStatus = application.status

  await db.application.update({
    where: { id: applicationId },
    data: { status },
  })

  let emailSent = true

  if (status === "ACCEPTED" && previousStatus !== "ACCEPTED") {
    emailSent = await sendApplicationAcceptedEmail({
      applicationId: application.id,
      applicantName: application.student.name,
      applicantEmail: application.student.email,
      societyName: application.society.name,
    })
  }

  revalidatePath(`/admin/societies/${application.societyId}`)

  return { status, emailSent }
}

export async function sendInterviewInvitation(applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      society: true,
      student: { select: { name: true, email: true } },
    },
  })

  if (
    !application ||
    !(
      application.society.adminId === session.user.id ||
      (await db.societyAdmin.findUnique({
        where: {
          societyId_userId: {
            societyId: application.societyId,
            userId: session.user.id,
          },
        },
      }))
    )
  ) {
    throw new Error("Not authorized to contact this applicant")
  }

  if (application.status === "REJECTED") {
    throw new Error("A rejected applicant cannot be invited to an interview")
  }

  const emailSent = await sendInterviewInvitationEmail({
    applicationId: application.id,
    applicantName: application.student.name,
    applicantEmail: application.student.email,
    societyName: application.society.name,
  })

  return { emailSent }
}
