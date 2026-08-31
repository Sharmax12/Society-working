"use server"
import { db } from "@/lib/db"


export async function getOpenSocieties() {
  return db.society.findMany({
    where: { isOpen: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserApplications(userId: string) {
  return db.application.findMany({
    where: { studentId: userId },
    include: { society: true },
    orderBy: { submittedAt: "desc" },
  })
}

export async function getSocietyWithQuestions(societyId: string) {
  return db.society.findUnique({
    where: { id: societyId },
    include: { questions: true },
  })
}

export async function getExistingApplication(studentId: string, societyId: string) {
  return db.application.findUnique({
    where: { studentId_societyId: { studentId, societyId } },
  })
}



import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

type QuestionInput = { prompt: string; required: boolean }

export async function createSociety(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") throw new Error("Not authorized")

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
  } catch {
    throw new Error("Invalid question data")
  }

  const validQuestions = questions.filter((q) => q.prompt?.trim())

  const society = await db.society.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      category: category?.trim() || undefined,
      deadline: new Date(deadline),
      adminId: session.user.id,
      questions: {
        create: validQuestions.map((q) => ({
          prompt: q.prompt.trim(),
          required: q.required,
        })),
      },
    },
  })

  revalidatePath("/admin")
  redirect(`/admin/societies/${society.id}`)
}