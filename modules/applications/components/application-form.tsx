"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitApplication } from "@/modules/applications/actions"
import { toast } from "sonner"
import type { Society, Question } from "@prisma/client"

export function ApplicationForm({
  society,
}: {
  society: Society & { questions: Question[] }
}) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await submitApplication(society.id, formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Roll number</label>
          <input
            name="rollNumber"
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            name="phone"
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {society.questions.map((q) => (
        <div key={q.id}>
          <label className="text-sm font-medium">
            {q.prompt} {q.required && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            name={`question-${q.id}`}
            required={q.required}
            rows={3}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      ))}

      <Button type="submit" variant="brand" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  )
}