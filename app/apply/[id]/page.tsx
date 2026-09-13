import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { getSocietyWithQuestions, getExistingApplication } from "@/modules/societies/queries"
import { ApplicationForm } from "@/modules/applications/components/application-form"

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const society = await getSocietyWithQuestions(id)
  if (!society) notFound()

  const existing = await getExistingApplication(session.user.id, id)
  if (existing) redirect("/dashboard")

  const isClosed = !society.isOpen || society.deadline < new Date()

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{society.name}</h1>
      <p className="text-muted-foreground mt-2 mb-8">{society.description}</p>

      {isClosed ? (
        <p className="text-sm text-muted-foreground border rounded-md p-4">
          Applications for this society are closed.
        </p>
      ) : (
        <ApplicationForm society={society} />
      )}
    </div>
  )
}