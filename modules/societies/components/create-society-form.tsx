"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createSociety } from "@/modules/societies/queries"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical, Info, Sparkles } from "lucide-react"

type Question = { prompt: string; required: boolean }

export function CreateSocietyForm() {
  const [questions, setQuestions] = useState<Question[]>([
    { prompt: "", required: true },
  ])
  const [isPending, startTransition] = useTransition()

  function addQuestion() {
    setQuestions((prev) => [...prev, { prompt: "", required: true }])
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  function handleSubmit(formData: FormData) {
    formData.set("questions", JSON.stringify(questions))
    startTransition(async () => {
      try {
        await createSociety(formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  const inputClass = "mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-3 border-b pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Info className="h-4 w-4" /></div>
        <div><h2 className="font-bold">Society basics</h2><p className="text-xs text-muted-foreground">The information students see first.</p></div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold">Society name</label>
          <input name="name" required className={inputClass} placeholder="e.g. Robotics Club" />
        </div>
        <div>
          <label className="text-sm font-semibold">Description</label>
          <textarea name="description" required rows={4} className={`${inputClass} resize-y`} placeholder="What does this society do? What can members expect?" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="text-sm font-semibold">Category</label><input name="category" className={inputClass} placeholder="e.g. Technical" /></div>
          <div><label className="text-sm font-semibold">Application deadline</label><input name="deadline" type="date" required className={inputClass} /></div>
        </div>
      </div>

      <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent"><Sparkles className="h-4 w-4" /></div><div><h2 className="font-bold">Application questions</h2><p className="text-xs text-muted-foreground">Learn who is applying before you approve them.</p></div></div>
          <Button type="button" size="sm" variant="outline" onClick={addQuestion}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add question</Button>
        </div>

        <div className="mt-5 space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="group flex items-start gap-2 rounded-2xl border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4">
              <GripVertical className="mt-3 hidden h-4 w-4 shrink-0 text-muted-foreground/40 sm:block" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Question {i + 1}</span>{q.required && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">Required</span>}</div>
                <input value={q.prompt} onChange={(e) => updateQuestion(i, { prompt: e.target.value })} placeholder="What would you like to know?" className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
                <label className="flex w-fit cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground"><input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(i, { required: e.target.checked })} className="h-4 w-4 accent-primary" /> Required answer</label>
              </div>
              {questions.length > 1 && <button type="button" onClick={() => removeQuestion(i)} aria-label={`Remove question ${i + 1}`} className="rounded-lg p-2 text-muted-foreground transition hover:bg-rose-500/10 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">You can add more questions later.</p>
        <Button type="submit" variant="brand" disabled={isPending} className="h-11 rounded-xl px-6">{isPending ? "Creating..." : "Create society"}</Button>
      </div>
    </form>
  )
}