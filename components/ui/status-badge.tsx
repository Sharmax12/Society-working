import { cn } from "@/lib/utils"
import { ApplicationStatus } from "@prisma/client"

const styles: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
}

const labels: Record<ApplicationStatus, string> = {
  PENDING: "Pending review",
  ACCEPTED: "Accepted",
  REJECTED: "Not selected",
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  )
}