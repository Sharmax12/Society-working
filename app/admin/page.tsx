import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, ChevronRight, Plus, ShieldCheck, Users } from "lucide-react"
import { getManagedSocieties } from "@/modules/societies/admin-queries"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const societies = await getManagedSocieties(session.user.id)
  const applicationCount = societies.reduce((total, society) => total + society._count.applications, 0)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.10] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin workspace
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Run your campus community.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage societies, review applications, and keep the next campus moment moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/societies/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl">
              <Plus className="h-4 w-4" /> New society
            </Link>
            <Link href="/admin/events/new" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background/80 px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background">
              <CalendarDays className="h-4 w-4" /> New event
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Societies</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{societies.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Communities you manage</p>
        </div>
        <div className="rounded-2xl border bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Applications</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{applicationCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">Across your societies</p>
        </div>
        <Link href="/admin/events" className="group rounded-2xl border bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Events</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-black tracking-tight">→</p>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Open event manager</p>
        </Link>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your spaces</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Society command center</h2>
          </div>
          <Link href="/societies" className="hidden items-center gap-1 text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:flex">
            View directory <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {societies.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
            <h3 className="mt-4 font-semibold">Your workspace is empty</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Create your first society and start building a community students want to join.</p>
            <Link href="/admin/societies/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Create society <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {societies.map((society, index) => (
              <Link key={society.id} href={`/admin/societies/${society.id}`} className="group relative overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-md shadow-primary/20">{String(index + 1).padStart(2, "0")}</div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight">{society.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{society._count.applications} application{society._count.applications !== 1 && "s"}</p>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="relative mt-5 flex items-center justify-between border-t pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Review members</span><span className="text-primary">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}