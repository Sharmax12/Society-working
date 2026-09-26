"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { updateApplicationStatus } from "@/modules/applications/actions"
import { toast } from "sonner"

export function ApplicationReviewCard({ application }: { application: any }) {
  const [isPending, startTransition] = useTransition()

  function handleUpdate(status: "ACCEPTED" | "REJECTED") {
    startTransition(async () => {
      try {
        await updateApplicationStatus(application.id, status)
        toast.success(`Application ${status.toLowerCase()}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <div className="border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{application.student.name}</p>
          <p className="text-xs text-muted-foreground">{application.student.email}</p>
          {application.student.rollNumber && (
            <p className="text-xs text-muted-foreground">
              Roll No: {application.student.rollNumber}
            </p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="space-y-2 text-sm">
        {application.answers.map((a: any) => (
          <div key={a.id}>
            <p className="text-muted-foreground">{a.question.prompt}</p>
            <p>{a.response}</p>
          </div>
        ))}
      </div>

      {application.status === "PENDING" && (
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="brand"
            disabled={isPending}
            onClick={() => handleUpdate("ACCEPTED")}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handleUpdate("REJECTED")}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}