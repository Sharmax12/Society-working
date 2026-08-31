import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOpenSocieties, getUserApplications } from "@/modules/societies/queries"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowUpRight } from "lucide-react"
import { SignOutButton } from "@/modules/auth/components/sign-out"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const [societies, applications] = await Promise.all([
    getOpenSocieties(),
    getUserApplications(session.user.id),
  ])

  const appliedSocietyIds = new Set(applications.map((a) => a.societyId))

  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Apply to a society section */}
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                Welcome back, {session.user.name}
            </p>
        </div>
        <SignOutButton />
    </div>
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Apply to a society
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse open societies and submit your application.
          </p>
        </div>

        {societies.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">
              No societies are currently accepting applications.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {societies.map((society) => {
              const alreadyApplied = appliedSocietyIds.has(society.id)
              return (
                <div
                  key={society.id}
                  className="group relative border rounded-xl p-5 flex flex-col justify-between bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200"
                >
                  <div>
                    {society.category && (
                      <span className="inline-block text-xs uppercase tracking-wider text-rose-600 font-semibold mb-1">
                        {society.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg text-foreground">
                      {society.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {society.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between">
                    {alreadyApplied ? (
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                        Already applied
                      </span>
                    ) : (
                      <Link
                        href={`/apply/${society.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors group-hover:translate-x-0.5 transform duration-150"
                      >
                        Apply now <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* My applications section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            My applications
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track the status of societies you've applied to.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">
              You haven't applied to any societies yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border rounded-xl p-4 flex items-center justify-between bg-card shadow-sm hover:border-border transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{app.society.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Applied on {new Date(app.submittedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}