import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Users, UserRound, MessageSquareText } from "lucide-react";
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
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section: Minimal & Clean */}
        <section className="flex flex-col justify-between gap-6 border-b pb-10 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Dashboard / {firstName}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here is what is happening across your campus today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Applications</p>
              <p className="text-sm font-semibold">{applications.length} Active</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <SignOutButton />
          </div>
        </section>

        {/* Quick Navigation Toolbar */}
        <div className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-4">
          <Link href="/profile" className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:border-foreground/30">
            <div className="flex items-center gap-3">
              <UserRound className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium">Profile</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/posts" className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:border-foreground/30">
            <div className="flex items-center gap-3">
              <MessageSquareText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium">Posts</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/societies" className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:border-foreground/30">
            <div className="flex items-center gap-3">
              <Compass className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium">Societies</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/events" className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:border-foreground/30">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium">Events</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Societies Grid */}
        <section className="mt-6">
          <div className="flex items-end justify-between pb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Open Societies</h2>
              <p className="text-xs text-muted-foreground">Communities currently accepting new applications.</p>
            </div>
            <Link href="/societies" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>

          {societies.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <Users className="mx-auto h-5 w-5 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">No active openings right now.</p>
              <p className="mt-1 text-xs text-muted-foreground">Check back later when new application cycles open up.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {societies.slice(0, 6).map((society) => (
                <div key={society.id} className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition hover:border-foreground/30">
                  <div>
                    <div className="flex items-center justify-between">
                      {society.category ? (
                        <Badge variant="outline" className="rounded-md text-[10px] uppercase font-mono tracking-wider">
                          {society.category}
                        </Badge>
                      ) : <span />}
                    </div>
                    <h3 className="mt-3 text-base font-bold">{society.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {society.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs">
                    {appliedSocietyIds.has(society.id) ? (
                      <StatusBadge status={applications.find((a) => a.societyId === society.id)?.status ?? "PENDING"} />
                    ) : (
                      <Link href={`/apply/${society.id}`} className="font-semibold hover:underline">
                        Apply now →
                      </Link>
                    )}
                    <Link href={`/societies/${society.id}`} className="text-muted-foreground hover:text-foreground">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Applications / Journey Section */}
        <section className="mt-14">
          <div className="flex items-end justify-between pb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Your Applications</h2>
              <p className="text-xs text-muted-foreground">Status updates for communities you&apos;ve reached out to.</p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{applications.length} total</span>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="text-sm font-medium">No applications submitted yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Browse open societies above to start your journey.</p>
            </div>
          ) : (
            <div className="divide-y rounded-xl border bg-card">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{app.society.name}</p>
                    <p className="mt-0.5 text-[11px] font-mono text-muted-foreground">
                      Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
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