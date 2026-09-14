import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ClipboardCheck, ShieldCheck } from "lucide-react"
import { getSocietyWithQuestions, getExistingApplication } from "@/modules/societies/queries"
import { ApplicationForm } from "@/modules/applications/components/application-form"
import { Badge } from "@/components/ui/badge"

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const society = await getSocietyWithQuestions(id)
  if (!society) notFound()
  const existing = await getExistingApplication(session.user.id, id)
  if (existing) redirect("/dashboard")

  return <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-4xl">
      <Link href={`/societies/${society.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to society</Link>
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.1] via-card to-accent/[0.08] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-primary"><ClipboardCheck className="h-4 w-4" /> Application</div><Badge variant="secondary" className="rounded-full capitalize">{society.category ?? "Community"}</Badge><h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-5xl">Apply to {society.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{society.description}</p></div><div className="flex items-center gap-2 rounded-2xl border bg-background/70 px-4 py-3 text-xs font-semibold text-muted-foreground backdrop-blur"><ShieldCheck className="h-4 w-4 text-primary" /> One application per student</div></div>
      </section>
      <section className="mt-6 rounded-[1.75rem] border bg-card/90 p-5 shadow-sm sm:p-8"><div className="mb-7 border-b pb-5"><h2 className="text-xl font-black">Tell them about you</h2><p className="mt-1 text-sm text-muted-foreground">Answer the questions thoughtfully. Required fields are marked with an asterisk.</p></div><ApplicationForm society={society} /></section>
    </div>
  </main>
}