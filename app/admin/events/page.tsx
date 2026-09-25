import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CalendarDays, Plus } from "lucide-react"
import { getManagedEvents } from "@/modules/events/admin-queries"

export default async function AdminEventsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const { hasSocietyAdminAccess } = await import("@/modules/auth/authorization")
  if (session.user.role !== "ADMIN" && !(await hasSocietyAdminAccess(session.user.id))) redirect("/dashboard")

  const events = await getManagedEvents(session.user.id)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Admin workspace
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Programming</p>
          <h1 className="mt-1 text-4xl font-black tracking-[-0.04em]">Events</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">Shape what happens next. Publish and manage events for the societies you run.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl">
          <Plus className="h-4 w-4" /> Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="relative overflow-hidden rounded-[2rem] border border-dashed bg-card/70 px-6 py-16 text-center">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"><CalendarDays className="h-6 w-6" /></div>
          <h2 className="relative mt-5 text-xl font-bold">Nothing on the calendar yet</h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Create your first event and turn your society page into something students can actually plan around.</p>
          <Link href="/admin/events/new" className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Add the first event <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event, index) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group relative overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
              <div className="relative flex gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <CalendarDays className="h-4 w-4" />
                  <span className="mt-0.5 text-[10px] font-black uppercase">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="truncate text-lg font-bold tracking-tight">{event.title}</h2>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-muted-foreground">{event.society.name}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>Published</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
