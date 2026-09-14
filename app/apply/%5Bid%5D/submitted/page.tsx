import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Compass, Sparkles } from "lucide-react"
import { getExistingApplication, getSocietyWithQuestions } from "@/modules/societies/queries"

export default async function ApplicationSubmittedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const society = await getSocietyWithQuestions(id)
  if (!society) notFound()
  const application = await getExistingApplication(session.user.id, id)
  if (!application) redirect(`/apply/${id}`)

  return <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-12 sm:px-6"><div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" /><section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border bg-card/90 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-12"><div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 shadow-inner"><CheckCircle2 className="h-10 w-10" /></div><div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-primary" /> You&apos;re in the queue</div><h1 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-5xl">Application submitted</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">Your application to <span className="font-bold text-foreground">{society.name}</span> is in. You can track its status from your dashboard once the society team reviews it.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><Link href="/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl">Go to dashboard <ArrowRight className="h-4 w-4" /></Link><Link href="/societies" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-muted"><Compass className="h-4 w-4" /> Browse more</Link></div></section></main>
}
