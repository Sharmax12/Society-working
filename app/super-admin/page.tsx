import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ShieldCheck, Users, Building2, LifeBuoy, CreditCard } from "lucide-react"
import { db } from "@/lib/db"
import { VerificationControls } from "@/modules/platform/components/verification-controls"

export default async function SuperAdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard")

  const [societies, users, pending] = await Promise.all([
    db.society.findMany({
      include: {
        admin: { select: { name: true, email: true } },
        _count: { select: { applications: true, events: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.count(),
    db.society.count({ where: { verificationStatus: "PENDING" } }),
  ])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.09] via-background to-accent/[0.10] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" /> Platform workspace
          </div>
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">Keep the platform healthy.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Cross-tenant controls live here. Society admins handle their own communities; platform operations handles verification, support, compliance, and billing.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Societies", societies.length, Building2],
          ["Pending review", pending, ShieldCheck],
          ["Users", users, Users],
          ["Platform ops", "—", LifeBuoy],
        ].map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-2xl border bg-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{String(label)}</p>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight">{String(value)}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Cross-tenant queue</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Society verification</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm">
          {societies.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No societies yet.</div>
          ) : (
            <div className="divide-y">
              {societies.map((society) => (
                <div key={society.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-bold">{society.name}</h3>
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {society.verificationStatus}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Owner: {society.admin.name || society.admin.email} · {society._count.applications} applications · {society._count.events} events
                    </p>
                  </div>
                  <VerificationControls societyId={society.id} status={society.verificationStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card/70 p-5">
          <div className="flex items-center gap-2 font-bold"><LifeBuoy className="h-4 w-4 text-primary" /> Support</div>
          <p className="mt-1 text-sm text-muted-foreground">Keep cross-tenant support tooling separate from society operations.</p>
        </div>
        <div className="rounded-2xl border bg-card/70 p-5">
          <div className="flex items-center gap-2 font-bold"><CreditCard className="h-4 w-4 text-primary" /> Billing & compliance</div>
          <p className="mt-1 text-sm text-muted-foreground">Reserved for platform-wide controls rather than individual society management.</p>
        </div>
      </section>
    </main>
  )
}
