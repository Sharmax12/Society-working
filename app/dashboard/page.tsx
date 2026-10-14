import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Sparkles, Users, CheckCircle2, UserRound, MessageSquareText, Flame, Trophy } from "lucide-react";
import { getOpenSocieties, getUserApplications } from "@/modules/societies/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/modules/auth/components/sign-out";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");
  const [societies, applications] = await Promise.all([getOpenSocieties(), getUserApplications(session.user.id)]);
  const appliedSocietyIds = new Set(applications.map((a) => a.societyId));
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-background to-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-card/80 to-accent/[0.08] p-6 shadow-xl backdrop-blur-xl sm:p-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/50 px-3.5 py-1 text-[11px] font-black uppercase tracking-[.2em] text-primary shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Your Campus Space
              </div>
              <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Hey, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{firstName}</span>.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                A few things you might want to see today — find people, join something you care about, or see what&apos;s coming up.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border bg-background/60 p-3 text-right backdrop-blur-md sm:block shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Applications</p>
                <p className="text-lg font-black text-primary">{applications.length} Active</p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </section>

        {/* Primary Action Cards */}
        <div className="grid gap-4 pt-8 sm:grid-cols-2">
          <Link href="/profile" className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 relative">
              <p className="font-black text-base group-hover:text-primary transition-colors">Your profile</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Add your name, college, bio, and profile photo.</p>
            </div>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/posts" className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 relative">
              <p className="font-black text-base group-hover:text-accent transition-colors">Posts</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Share updates and see what your campus community is posting.</p>
            </div>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Secondary Navigation Grid */}
        <div className="grid gap-4 py-5 sm:grid-cols-3">
          <Link href="/societies" className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20" />
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Compass className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <p className="mt-6 text-lg font-black tracking-tight">Find something you&apos;ll like</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse societies and see where you fit.</p>
          </Link>

          <Link href="/events" className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-xl transition-all group-hover:bg-accent/20" />
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <CalendarDays className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
            </div>
            <p className="mt-6 text-lg font-black tracking-tight">See what&apos;s happening</p>
            <p className="mt-1 text-sm text-muted-foreground">Events, meetups, and things worth showing up for.</p>
          </Link>

          <Link href="/connect" className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-xl transition-all group-hover:bg-violet-500/20" />
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 text-violet-500 transition-transform group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-500" />
            </div>
            <p className="mt-6 text-lg font-black tracking-tight">Connect with people</p>
            <p className="mt-1 text-sm text-muted-foreground">Discover students, send requests, and build your campus network.</p>
          </Link>
        </div>

        {/* Open Societies Section */}
        <section className="mt-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[.18em] text-primary">
                <Flame className="h-3.5 w-3.5" /> For you
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Maybe your next thing is here</h2>
              <p className="mt-1 text-sm text-muted-foreground">These societies are open to new members right now.</p>
            </div>
            <Link href="/societies" className="hidden items-center gap-1.5 text-sm font-bold text-muted-foreground transition hover:text-primary sm:flex">
              Browse everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {societies.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-primary/20 bg-card/60 p-14 text-center backdrop-blur-sm">
              <Users className="mx-auto h-9 w-9 text-muted-foreground/40" />
              <p className="mt-4 font-bold text-base">Nothing open just yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">That&apos;s okay — new societies will show up here as applications open.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {societies.slice(0, 6).map((society, index) => (
                <div key={society.id} className="group relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
                  <div className="relative flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border bg-background/50 px-2.5 py-0.5 text-[10px] font-black text-muted-foreground shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {society.category && (
                    <Badge variant="secondary" className="relative mt-5 rounded-full px-3 py-1 text-[11px] font-semibold capitalize">
                      {society.category}
                    </Badge>
                  )}
                  <h3 className="relative mt-3 text-xl font-black tracking-tight">{society.name}</h3>
                  <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{society.description}</p>
                  <div className="relative mt-6 flex items-center justify-between border-t pt-4">
                    {appliedSocietyIds.has(society.id) ? (
                      <StatusBadge status={applications.find((a) => a.societyId === society.id)?.status ?? "PENDING"} />
                    ) : (
                      <Link href={`/apply/${society.id}`} className="text-sm font-bold text-primary transition-all hover:translate-x-0.5 hover:underline">
                        I&apos;m interested →
                      </Link>
                    )}
                    <Link href={`/societies/${society.id}`} aria-label={`View ${society.name}`} className="text-xs font-bold text-muted-foreground transition hover:text-foreground">
                      Take a look
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Journey Section */}
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[.18em] text-accent">
                <Trophy className="h-3.5 w-3.5" /> Your journey
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Where you&apos;ve reached so far</h2>
              <p className="mt-1 text-sm text-muted-foreground">A quick look at the communities you&apos;ve reached out to.</p>
            </div>
            <div className="rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1 text-xs font-bold text-accent shadow-sm">
              {applications.length} {applications.length === 1 ? "application" : "applications"}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-accent/20 bg-card/60 p-12 text-center backdrop-blur-sm">
              <CheckCircle2 className="mx-auto h-9 w-9 text-muted-foreground/40" />
              <p className="mt-4 font-bold text-base">You haven&apos;t applied anywhere yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">No pressure. When you find a community that feels right, it&apos;ll show up here.</p>
              <Link href="/societies" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105">
                Explore societies <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border bg-card shadow-sm">
              {applications.map((app, index) => (
                <div key={app.id} className={`flex items-center justify-between gap-4 p-4 sm:p-6 transition-colors hover:bg-muted/40 ${index > 0 ? "border-t" : ""}`}>
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xs font-black text-primary shadow-inner">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-base">{app.society.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Applied {new Date(app.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
