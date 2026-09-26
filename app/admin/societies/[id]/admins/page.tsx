import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { getSocietyApplications } from "@/modules/societies/admin-queries"
import { SocietyAdminManager } from "@/modules/societies/components/society-admin-manager"

export default async function SocietyAdminsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const { hasSocietyAdminAccess } = await import("@/modules/auth/authorization")
  if (session.user.role !== "ADMIN" && !(await hasSocietyAdminAccess(session.user.id))) redirect("/dashboard")

  const data = await getSocietyApplications(id, session.user.id)
  if (!data) notFound()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href={"/admin/societies/" + id} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {data.society.name}
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.08] p-6 shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Tenant administration
          </div>
          <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">Manage access</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add or remove admins for <strong className="text-foreground">{data.society.name}</strong>. Admin access is scoped to this society.
          </p>
        </div>
      </section>

      <div className="mt-6">
        <SocietyAdminManager societyId={id} admins={data.society.admins} />
      </div>
    </main>
  )
}