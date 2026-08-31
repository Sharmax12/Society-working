import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { getSocietyApplications } from "@/modules/societies/admin-queries"
import { ApplicationReviewCard } from "@/modules/applications/components/application-review-card"

export default async function SocietyApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const data = await getSocietyApplications(id, session.user.id)
  if (!data) notFound()

  const { society, applications } = data

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{society.name}</h1>
      <p className="text-muted-foreground mt-1 mb-8">
        {applications.length} application{applications.length !== 1 && "s"}
      </p>

      <div className="space-y-4">
        {applications.map((app) => (
          <ApplicationReviewCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  )
}