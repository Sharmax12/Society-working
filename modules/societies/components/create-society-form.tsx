"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createSociety } from "@/modules/societies/queries"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

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
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    )
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

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Society name</label>
          <input
            name="name"
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Robotics Club"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            placeholder="What does this society do?"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              name="category"
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              placeholder="e.g. Technical"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Application deadline</label>
            <input
              name="deadline"
              type="date"
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Application questions</label>
          <Button type="button" size="sm" variant="outline" onClick={addQuestion}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add question
          </Button>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2 border rounded-lg p-3">
              <div className="flex-1 space-y-2">
                <input
                  value={q.prompt}
                  onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                  placeholder={`Question ${i + 1}`}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(i, { required: e.target.checked })}
                  />
                  Required
                </label>
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="text-muted-foreground hover:text-rose-500 mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" variant="brand" disabled={isPending}>
        {isPending ? "Creating..." : "Create society"}
      </Button>
    </form>
  )
}