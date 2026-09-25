import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight, CalendarPlus } from "lucide-react"
import { getManagedSociety } from "@/modules/societies/admin-queries"

export default async function SocietyCreatedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const society = await getManagedSociety(id, session.user.id)
  if (!society) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Society created
      </h1>
      <p className="mt-3 text-muted-foreground">
        <span className="font-medium text-foreground">{society.name}</span>{" "}
        has been created and is awaiting platform verification. Once verified, it can appear publicly and accept applications.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/admin/societies/${society.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          View applications
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <CalendarPlus className="h-4 w-4" />
          Create an event for it
        </Link>
      </div>

      <Link
        href="/admin"
        className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to your societies
      </Link>
    </div>
  )
}
