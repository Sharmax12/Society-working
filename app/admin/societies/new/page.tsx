import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2, Sparkles } from "lucide-react"
import { CreateSocietyForm } from "@/modules/societies/components/create-society-form"

export default async function NewSocietyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Admin workspace
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.1] via-card to-accent/[0.08] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:flex">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Admin builder
            </div>
            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Create a society</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Give students a clear reason to join, then shape the questions you want answered before they apply.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] border bg-card/80 p-5 shadow-sm sm:p-8">
        <CreateSocietyForm />
      </section>
    </main>
  )
}