import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ClipboardList, Users } from "lucide-react"
import { getSocietyApplications } from "@/modules/societies/admin-queries"
import { ApplicationReviewList } from "@/modules/applications/components/application-review-list"

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
  const pending = applications.filter((application) => application.status === "PENDING").length

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        <ArrowLeft className="h-4 w-4" /> Admin workspace
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.08] p-6 shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
              <ClipboardList className="h-3.5 w-3.5 text-primary" /> Application review
            </div>
            <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">{society.name}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Review, filter, and action students who want to join your community.</p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-xl border bg-background/70 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-black">{applications.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
            </div>
            <div className="rounded-xl border bg-background/70 px-4 py-3 text-center backdrop-blur">
              <p className="text-xl font-black text-accent">{pending}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Applicants</div>
        <Link href="/societies" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">View public directory <ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <h2 className="mt-4 font-bold">No applications yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Once students apply, their responses will appear here.</p>
        </div>
      ) : (
        <ApplicationReviewList applications={applications} />
      )}
    </main>
  )
}