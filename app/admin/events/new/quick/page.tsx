import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CalendarPlus, ArrowLeft, Image as ImageIcon, Link2, MapPin, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { createQuickEvent } from "@/modules/events/admin-queries"

export default async function QuickCreateEventPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const { hasSocietyAdminAccess } = await import("@/modules/auth/authorization")
  if (session.user.role !== "ADMIN" && !(await hasSocietyAdminAccess(session.user.id))) {
    redirect("/dashboard")
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/admin/events/new" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to event builder
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-accent/[0.12] via-card to-primary/[0.08] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg sm:grid">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Quick publish
            </div>
            <h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Create an event instantly</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Publish an event directly. A society profile is not required.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] border bg-card/90 p-5 shadow-sm sm:p-8">
        <form action={createQuickEvent} className="space-y-8">
          <div>
            <label className="text-sm font-semibold">Event title</label>
            <input name="title" required className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="e.g. Annual Tech Fest" />
          </div>

          <div>
            <label className="text-sm font-semibold">Description</label>
            <textarea name="description" required rows={5} className="mt-2 w-full resize-y rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="What’s happening? Give students a reason to show up." />
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <CalendarPlus className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold">When & where</p>
                <p className="text-xs text-muted-foreground">Make the event easy to plan for.</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Date & time</label>
                <input name="date" type="datetime-local" required className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />\n              </div>\n              <div>\n                <label className="text-sm font-semibold">End date & time <span className="font-normal text-muted-foreground">(optional)</span></label>\n                <input name="endDate" type="datetime-local" className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />\n                <p className="mt-1 text-xs text-muted-foreground">Leave blank for a single-time event.</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input name="location" className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 pl-10 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="e.g. Main Auditorium" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4 text-primary" /> Photo URL
              </label>
              <input name="imageUrl" type="url" className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="https://..." />
              <p className="mt-1.5 text-xs text-muted-foreground">Optional poster or banner image.</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Link2 className="h-4 w-4 text-primary" /> RSVP / invite link
              </label>
              <input name="inviteLink" type="url" className="mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="https://form..." />
              <p className="mt-1.5 text-xs text-muted-foreground">Optional registration or community invite.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> This publishes a standalone community event.
            </div>
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl">
              <Save className="h-4 w-4" /> Publish event
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
