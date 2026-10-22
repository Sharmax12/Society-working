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

function readFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : null
}

function assertRecordId(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 128) {
    throw new Error("Invalid " + label)
  }
}

export async function submitApplication(societyId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  assertRecordId(societyId, "society")
  if (!(formData instanceof FormData)) throw new Error("Invalid application form")

  const studentId = session.user.id

  const society = await db.society.findUnique({
    where: { id: societyId },
    include: { questions: true },
  })

  if (!society) throw new Error("Society not found")
  if (
    society.verificationStatus !== "VERIFIED" ||
    !society.isOpen ||
    society.deadline.getTime() < Date.now()
  ) {
    throw new Error("Applications for this society are closed")
  }

  const existing = await db.application.findUnique({
    where: { studentId_societyId: { studentId, societyId } },
    select: { id: true },
  })
  if (existing) throw new Error("You've already applied to this society")

  const student = await db.user.findUnique({
    where: { id: studentId },
    select: { name: true, email: true },
  })
  if (!student) throw new Error("Student account not found")

  // Validate every field before mutating the user profile or creating an
  // application. A failed form must not partially overwrite the user's data.
  const rollNumber = readFormString(formData, "rollNumber")
  const phone = readFormString(formData, "phone")

  if (!rollNumber || rollNumber.length > 80) {
    throw new Error("Roll number is required and must be 80 characters or fewer")
  }
  if (!phone || phone.length > 32 || !/^[+()\d\s-]{7,32}$/.test(phone)) {
    throw new Error("Enter a valid phone number")
  }
  if (society.questions.length > 100) {
    throw new Error("This application form has too many questions. Please contact the society")
  }

  const answers = society.questions.map((question) => {
    const rawResponse = formData.get("question-" + question.id)
    if (rawResponse === null && !question.required) {
      return { questionId: question.id, name: question.prompt, response: "" }
    }
    if (typeof rawResponse !== "string") {
      throw new Error("Invalid answer for: " + question.prompt)
    }

    const response = rawResponse.trim()
    if (response.length > 2000) {
      throw new Error("Each answer must be 2,000 characters or fewer")
    }
    if (question.required && !response) {
      throw new Error('Please answer: "' + question.prompt + '"')
    }

    return {
      questionId: question.id,
      name: question.prompt,
      response,
    }
  })

  // Keep the profile update and application write atomic. The database's
  // unique(studentId, societyId) constraint remains the final duplicate guard.
  const application = await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: studentId },
      data: { rollNumber, phone },
    })

    return tx.application.create({
      data: {
        name: student.name,
        studentId,
        societyId,
        answers: { create: answers },
      },
      include: { society: { select: { name: true } } },
    })
  })

  await sendApplicationReceivedEmail({
    applicationId: application.id,
    applicantName: student.name,
    applicantEmail: student.email,
    societyName: application.society.name,
  })

  revalidatePath("/dashboard")
  redirect("/apply/" + societyId + "/submitted")
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  assertRecordId(applicationId, "application")
  // Server-action arguments are client-controlled at runtime; don't rely on TS.
  if (status !== "ACCEPTED" && status !== "REJECTED") {
    throw new Error("Invalid application status")
  }

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
        select: { id: true },
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

  revalidatePath("/admin/societies/" + application.societyId)

  return { status, emailSent }
}

export async function sendInterviewInvitation(applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  assertRecordId(applicationId, "application")

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
        select: { id: true },
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
