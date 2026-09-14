import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, MessageCircle, Sparkles, Users, CheckCircle2 } from "lucide-react";
import { getOpenSocieties, getUserApplications } from "@/modules/societies/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/modules/auth/components/sign-out";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");
  const [societies, applications] = await Promise.all([getOpenSocieties(), getUserApplications(session.user.id)]);
  const appliedSocietyIds = new Set(applications.map((a) => a.societyId));
  const firstName = session.user.name?.split(" ")[0] ?? "student";

  return <main className="min-h-screen">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.1] via-card to-accent/[0.08] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] text-primary"><Sparkles className="h-4 w-4" /> Student space</div><h1 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Hey, {firstName}.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Your campus is moving. Here&apos;s where you can jump in next.</p></div>
          <SignOutButton />
        </div>
      </section>

      <div className="grid gap-3 py-7 sm:grid-cols-3">
        <Link href="/societies" className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Compass className="h-5 w-5" /></div><ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div><p className="mt-6 text-lg font-black">Discover societies</p><p className="mt-1 text-sm text-muted-foreground">Find communities worth joining.</p></Link>
        <Link href="/events" className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><CalendarDays className="h-5 w-5" /></div><ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" /></div><p className="mt-6 text-lg font-black">Campus events</p><p className="mt-1 text-sm text-muted-foreground">See what&apos;s happening next.</p></Link>
        <div className="rounded-2xl border border-dashed bg-muted/30 p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><MessageCircle className="h-5 w-5" /></div><div className="mt-6 flex items-center gap-2"><p className="text-lg font-black">Campus chat</p><Badge variant="secondary" className="rounded-full text-[10px]">Soon</Badge></div><p className="mt-1 text-sm text-muted-foreground">Conversations for your campus.</p></div>
      </div>

      <section className="mt-4"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-primary">Explore</p><h2 className="mt-1 text-2xl font-black tracking-tight">Find your community</h2><p className="mt-1 text-sm text-muted-foreground">Societies currently accepting applications.</p></div><Link href="/societies" className="hidden items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary sm:flex">View all <ArrowRight className="h-4 w-4" /></Link></div>
        {societies.length === 0 ? <div className="rounded-[1.75rem] border border-dashed bg-card/60 p-14 text-center"><Users className="mx-auto h-7 w-7 text-muted-foreground/50" /><p className="mt-4 font-bold">No societies are open right now.</p><p className="mt-1 text-sm text-muted-foreground">Check back soon for the next opportunity.</p></div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{societies.slice(0,6).map((society,index) => <div key={society.id} className="group relative overflow-hidden rounded-[1.6rem] border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" /><div className="relative flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Users className="h-5 w-5" /></div><span className="text-[10px] font-black text-muted-foreground">{String(index+1).padStart(2,"0")}</span></div>{society.category && <Badge variant="secondary" className="relative mt-6 rounded-full capitalize">{society.category}</Badge>}<h3 className="relative mt-3 text-lg font-black">{society.name}</h3><p className="relative mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{society.description}</p><div className="relative mt-5 flex items-center justify-between border-t pt-4">{appliedSocietyIds.has(society.id) ? <StatusBadge status={applications.find(a=>a.societyId===society.id)?.status ?? "PENDING"}/> : <Link href={`/apply/${society.id}`} className="text-sm font-bold text-primary transition hover:underline">Apply now →</Link>}<Link href={`/societies/${society.id}`} aria-label={`View ${society.name}`} className="text-xs font-semibold text-muted-foreground hover:text-foreground">View</Link></div></div>)}</div>}
      </section>

      <section className="mt-14"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-accent">Your activity</p><h2 className="mt-1 text-2xl font-black tracking-tight">My applications</h2><p className="mt-1 text-sm text-muted-foreground">Keep track of where you stand.</p></div><div className="rounded-full border bg-card px-3 py-1 text-xs font-bold">{applications.length} total</div></div>{applications.length === 0 ? <div className="rounded-[1.75rem] border border-dashed bg-card/60 p-12 text-center"><CheckCircle2 className="mx-auto h-7 w-7 text-muted-foreground/50" /><p className="mt-4 font-bold">Nothing submitted yet</p><p className="mt-1 text-sm text-muted-foreground">Your next community could be one click away.</p><Link href="/societies" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Explore societies <ArrowRight className="h-4 w-4" /></Link></div> : <div className="overflow-hidden rounded-[1.5rem] border bg-card shadow-sm">{applications.map((app,index) => <div key={app.id} className={`flex items-center justify-between gap-4 p-4 sm:p-5 ${index > 0 ? "border-t" : ""}`}><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-black text-primary">{index+1}</div><div className="min-w-0"><p className="truncate font-bold">{app.society.name}</p><p className="mt-1 text-xs text-muted-foreground">Applied {new Date(app.submittedAt).toLocaleDateString()}</p></div></div><StatusBadge status={app.status}/></div>)}</div>}</section>
    </div>
  </main>;
}
