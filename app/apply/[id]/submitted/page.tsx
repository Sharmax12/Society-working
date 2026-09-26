import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { getExistingApplication, getSocietyWithQuestions } from "@/modules/societies/queries"

export default async function ApplicationSubmittedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const society = await getSocietyWithQuestions(id)
  if (!society) notFound()

  // Only show the confirmation to the student who actually applied —
  // visiting this URL without a submitted application sends you back
  // to the apply flow instead.
  const application = await getExistingApplication(session.user.id, id)
  if (!application) redirect(`/apply/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Application submitted
      </h1>
      <p className="mt-3 text-muted-foreground">
        Your application to <span className="font-medium text-foreground">{society.name}</span>{" "}
        is in. You&apos;ll see its status on your dashboard once it&apos;s reviewed.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Go to dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/societies"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Browse more societies
        </Link>
      </div>
    </div>
  )
}
