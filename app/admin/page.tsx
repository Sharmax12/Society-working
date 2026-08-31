import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getManagedSocieties } from "@/modules/societies/admin-queries"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const societies = await getManagedSocieties(session.user.id)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Your societies</h1>
      <p className="text-muted-foreground mt-1 mb-8">
        Review applications for the societies you manage.
      </p>
      <Link
      href="/admin/societies/new"
      className="inline-block mt-4 text-sm font-medium text-rose-600 hover:underline"
      >
        + Create a new society\
        </Link>

      {societies.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You don't manage any societies yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {societies.map((society) => (
            <Link
              key={society.id}
              href={`/admin/societies/${society.id}`}
              className="border rounded-xl p-5 hover:border-rose-300 transition-colors"
            >
              <h3 className="font-semibold text-lg">{society.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {society._count.applications} application
                {society._count.applications !== 1 && "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}