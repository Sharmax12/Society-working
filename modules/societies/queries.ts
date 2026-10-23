"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { consumeRateLimit } from "@/lib/rate-limit"

export async function getOpenSocieties() {
  return db.society.findMany({
    where: { verificationStatus: "VERIFIED", isOpen: true, deadline: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSocietiesForDirectory() {
  return db.society.findMany({
    where: { verificationStatus: "VERIFIED" },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * The passed ID is only a consistency check, never the identity source.
 * This function is exported from a server-action module, so callers can send
 * arbitrary arguments over the network.
 */
export async function getUserApplications(userId: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Not authorized to read these applications")
  }

  return db.application.findMany({
    where: { studentId: session.user.id },
    include: {
      society: {
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          deadline: true,
          isOpen: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  })
}

export async function getSocietyWithQuestions(societyId: string) {
  return db.society.findUnique({
    where: { id: societyId, verificationStatus: "VERIFIED" },
    include: { questions: true },
  })
}

export async function getExistingApplication(studentId: string, societyId: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.id !== studentId) return null

  return db.application.findUnique({
    where: { studentId_societyId: { studentId: session.user.id, societyId } },
  })
}


type QuestionInput = { prompt: string; required: boolean }

export async function createSociety(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") throw new Error("Only society admins can create societies")

  let creationLimit
  try {
    creationLimit = await consumeRateLimit("societies:create", session.user.id, 10, 24 * 60 * 60)
  } catch {
    throw new Error("Society creation is temporarily unavailable. Please try again later.")
  }
  if (!creationLimit.allowed) {
    throw new Error("Too many societies created. Please try again tomorrow.")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const deadline = formData.get("deadline") as string
  const questionsRaw = formData.get("questions") as string

  if (!name?.trim()) throw new Error("Society name is required")
  if (!description?.trim()) throw new Error("Description is required")
  if (!deadline) throw new Error("Deadline is required")

  let questions: QuestionInput[] = []
  try {
    questions = JSON.parse(questionsRaw || "[]")
    if (
      !Array.isArray(questions) ||
      questions.length > 30 ||
      questions.some((q) =>
        typeof q !== "object" ||
        q === null ||
        typeof q.prompt !== "string" ||
        typeof q.required !== "boolean"
      )
    ) {
      throw new Error("Invalid question data")
    }
  } catch {
    throw new Error("Invalid question data")
  }

  const validQuestions = questions
    .filter((q) => q.prompt.trim())
    .map((q) => ({ prompt: q.prompt.trim().slice(0, 500), required: q.required }))

  const parsedDeadline = new Date(deadline)
  if (Number.isNaN(parsedDeadline.getTime()) || parsedDeadline.getTime() <= Date.now()) {
    throw new Error("Choose a valid future application deadline")
  }
  if (name.trim().length > 120 || description.trim().length > 5000) {
    throw new Error("Society name or description is too long")
  }

  const society = await db.society.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      category: category?.trim().slice(0, 80) || undefined,
      deadline: parsedDeadline,
      adminId: session.user.id,
      admins: { create: { userId: session.user.id } },
      questions: {
        create: validQuestions.map((q) => ({
          prompt: q.prompt,
          required: q.required,
        })),
      },
    },
  })

  revalidatePath("/admin")
  redirect(`/admin/societies/${society.id}/created`)
}