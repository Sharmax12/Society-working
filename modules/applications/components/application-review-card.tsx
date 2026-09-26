"use client"

import { useState, useTransition } from "react"
import { Check, Loader2, Mail, Phone, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { sendInterviewInvitation, updateApplicationStatus } from "@/modules/applications/actions"
import { toast } from "sonner"
import type { ApplicationStatus } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ReviewApplication = {
  id: string
  status: ApplicationStatus
  student: {
    name: string | null
    email: string
    phone: string | null
    rollNumber: string | null
  }
  answers: {
    id: string
    response: string
    question: { prompt: string }
  }[]
}

export function ApplicationReviewCard({ application }: { application: ReviewApplication }) {
  const [isPending, startTransition] = useTransition()
  const [isInformPending, startInformTransition] = useTransition()
  const [informOpen, setInformOpen] = useState(false)
  const [interviewSent, setInterviewSent] = useState(false)

  function handleUpdate(status: "ACCEPTED" | "REJECTED") {
    startTransition(async () => {
      try {
        const result = await updateApplicationStatus(application.id, status)

        if (status === "ACCEPTED" && !result.emailSent) {
          toast.warning("Application accepted, but the acceptance email could not be sent.")
        } else {
          toast.success(`Application ${status.toLowerCase()}`)
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  function handleInform() {
    startInformTransition(async () => {
      try {
        const result = await sendInterviewInvitation(application.id)
        if (!result.emailSent) {
          toast.error("Email could not be sent. Verify your Resend domain and EMAIL_FROM settings.")
          return
        }
        setInterviewSent(true)
        setInformOpen(false)
        toast.success("Interview invitation sent")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  const initials = (application.student.name ?? application.student.email)
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card/90 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
      <div className="border-b bg-muted/20 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm shadow-primary/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold tracking-tight">{application.student.name ?? "Unnamed applicant"}</p>
              <a href={`mailto:${application.student.email}`} className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground transition hover:text-primary">
                <Mail className="h-3 w-3 shrink-0" /> {application.student.email}
              </a>
              {application.student.phone && (
                <a href={`tel:${application.student.phone}`} className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground transition hover:text-primary">
                  <Phone className="h-3 w-3 shrink-0" /> {application.student.phone}
                </a>
              )}
              {application.student.rollNumber && (
                <p className="mt-0.5 text-xs text-muted-foreground">Roll No. {application.student.rollNumber}</p>
              )}
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {application.answers.length > 0 ? application.answers.map((answer, index) => (
          <div key={answer.id} className="grid gap-1.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Q{index + 1} · {answer.question.prompt}
            </p>
            <p className="text-sm leading-6 text-foreground/90">{answer.response}</p>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No written responses were submitted.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t bg-muted/10 p-4 sm:flex-row sm:justify-end">
        <Dialog open={informOpen} onOpenChange={setInformOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isInformPending || application.status === "REJECTED" || interviewSent}
              className="rounded-lg"
            >
              {isInformPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : interviewSent ? (
                <Check className="mr-1.5 h-4 w-4" />
              ) : (
                <Send className="mr-1.5 h-4 w-4" />
              )}
              {interviewSent ? "Interview email sent" : "Inform"}
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Invite for an interview?</DialogTitle>
              <DialogDescription>
                Send an automated interview invitation to{" "}
                <span className="font-medium text-foreground">{application.student.email}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">{application.student.name ?? "Applicant"}</p>
              <p className="mt-1 text-muted-foreground">{application.student.email}</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setInformOpen(false)} disabled={isInformPending}>
                Cancel
              </Button>
              <Button variant="brand" onClick={handleInform} disabled={isInformPending}>
                {isInformPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                {isInformPending ? "Sending…" : "Send interview email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {application.status === "PENDING" && (
          <>
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleUpdate("REJECTED")} className="rounded-lg sm:order-1">
              <X className="mr-1.5 h-4 w-4" /> Reject
            </Button>
            <Button size="sm" variant="brand" disabled={isPending} onClick={() => handleUpdate("ACCEPTED")} className="rounded-lg shadow-sm shadow-primary/15">
              {isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Check className="mr-1.5 h-4 w-4" />}
              {isPending ? "Updating…" : "Accept applicant"}
            </Button>
          </>
        )}
      </div>
    </article>
  )
}
