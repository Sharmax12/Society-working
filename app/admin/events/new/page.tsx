import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarPlus, Sparkles } from "lucide-react"
import { getManagedSocietiesForEvents } from "@/modules/events/admin-queries"
import { CreateEventForm } from "@/modules/events/components/create-event-form"

export default async function NewEventPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const { hasSocietyAdminAccess } = await import("@/modules/auth/authorization")
  const isGlobalAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
  if (!isGlobalAdmin && !(await hasSocietyAdminAccess(session.user.id))) redirect("/dashboard")
  const societies = await getManagedSocietiesForEvents()

  if (societies.length === 0) return <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6"><div className="w-full rounded-[2rem] border border-dashed bg-card/70 p-8 text-center sm:p-14"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><CalendarPlus className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-black">Create a quick event</h1><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">You can publish an event without first creating a full society profile. If you want a dedicated society page later, you can still create one separately.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/admin/events/new/quick" className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Quick event</Link><Link href="/admin/societies/new" className="inline-flex rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-bold">Create society</Link></div></div></main>

  return <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Admin workspace</Link>
    <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-accent/[0.12] via-card to-primary/[0.08] p-6 shadow-sm sm:p-9"><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" /><div className="relative flex items-start gap-4"><div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg sm:grid"><CalendarPlus className="h-5 w-5" /></div><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-accent" /> Event builder</div><h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Create an event</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Turn an idea into a campus moment. Add the essentials, then publish it for everyone to discover.</p></div></div></section>
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Creating an event outside a society?</p>
        <p className="mt-1 text-sm text-muted-foreground">Publish a campus activity with its own host and details.</p>
      </div>
      <Link href="/admin/events/new/quick" className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold transition hover:border-primary/40">Create standalone event</Link>
    </div>
    <section className="mt-6 rounded-[1.75rem] border bg-card/90 p-5 shadow-sm sm:p-8"><CreateEventForm societies={societies} /></section>
  </main>
}
