"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitApplication } from "@/modules/applications/actions"
import { toast } from "sonner"
import type { Society, Question } from "@prisma/client"
import { ArrowRight, CheckCircle2, Phone, UserRound, Heart } from "lucide-react"

export function ApplicationForm({ society }: { society: Society & { questions: Question[] } }) {
  const [isPending, startTransition] = useTransition()
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try { await submitApplication(society.id, formData) } catch (err) { toast.error(err instanceof Error ? err.message : "Something went wrong") }
    })
  }
  const input = "mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
  return <form action={handleSubmit} className="space-y-7">
    <div className="rounded-2xl bg-primary/[0.06] p-4 sm:p-5"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Heart className="h-4 w-4" /></div><div><p className="text-sm font-black">Tell them a little about you.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Nothing too formal. Just enough for the society team to get to know who&apos;s interested.</p></div></div></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="text-sm font-semibold">Roll number</label><div className="relative"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input name="rollNumber" required className={`${input} pl-10`} placeholder="e.g. 23CS101" /></div></div>
      <div><label className="text-sm font-semibold">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input name="phone" type="tel" required className={`${input} pl-10`} placeholder="A number they can reach you on" /></div></div>
    </div>
    {society.questions.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2 border-b pb-4"><CheckCircle2 className="h-4 w-4 text-primary" /><div><p className="text-sm font-bold">A few quick questions</p><p className="text-xs text-muted-foreground">There&apos;s no perfect answer here.</p></div><span className="ml-auto text-xs text-muted-foreground">{society.questions.length} question{society.questions.length !== 1 ? "s" : ""}</span></div>{society.questions.map((q, index) => <div key={q.id} className="rounded-2xl border bg-muted/20 p-4 sm:p-5"><label className="text-sm font-semibold leading-6"><span className="mr-2 text-xs font-black text-muted-foreground">{index + 1}.</span>{q.prompt}{q.required && <span className="ml-1 text-rose-500">*</span>}</label><textarea name={`question-${q.id}`} required={q.required} rows={4} placeholder="Say what comes to mind..." className={`${input} resize-y`} /></div>)}</div>}
    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted-foreground">Once you send this, the society team will take a look. No need to overthink it.</p><Button type="submit" variant="brand" disabled={isPending} className="h-11 rounded-xl px-6">{isPending ? "Sending your application..." : "Send it in"}<ArrowRight className="h-4 w-4" /></Button></div>
  </form>
}