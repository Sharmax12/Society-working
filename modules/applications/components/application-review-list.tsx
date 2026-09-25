"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Clock3, Search, Users, XCircle } from "lucide-react"
import type { ApplicationStatus } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { ApplicationReviewCard } from "@/modules/applications/components/application-review-card"

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

type Filter = "ALL" | ApplicationStatus

const filters: { value: Filter; label: string; icon: typeof Users }[] = [
  { value: "ALL", label: "All", icon: Users },
  { value: "PENDING", label: "Pending", icon: Clock3 },
  { value: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
]

export function ApplicationReviewList({ applications }: { applications: ReviewApplication[] }) {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [query, setQuery] = useState("")

  const counts = useMemo(() => ({
    ALL: applications.length,
    PENDING: applications.filter((application) => application.status === "PENDING").length,
    ACCEPTED: applications.filter((application) => application.status === "ACCEPTED").length,
    REJECTED: applications.filter((application) => application.status === "REJECTED").length,
  }), [applications])

  const visibleApplications = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return applications.filter((application) => {
      const matchesFilter = filter === "ALL" || application.status === filter
      if (!matchesFilter) return false
      if (!normalized) return true

      return [
        application.student.name,
        application.student.email,
        application.student.phone,
        application.student.rollNumber,
      ].some((value) => value?.toLowerCase().includes(normalized))
    })
  }, [applications, filter, query])

  return (
    <section>
      <div className="rounded-2xl border bg-card/80 p-3 shadow-sm backdrop-blur sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap gap-1.5" role="tablist" aria-label="Application status filter">
            {filters.map(({ value, label, icon: Icon }) => {
              const active = filter === value
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(value)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${active ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span className={active ? "text-background/70" : "text-muted-foreground/70"}>{counts[value]}</span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search applicants…"
              aria-label="Search applicants"
              className="h-10 rounded-xl pl-9"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 mt-5 flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-muted-foreground">
          Showing <span className="text-foreground">{visibleApplications.length}</span> of {applications.length}
        </p>
        {(query || filter !== "ALL") && (
          <button
            type="button"
            onClick={() => { setQuery(""); setFilter("ALL") }}
            className="text-xs font-bold text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Clear filters
          </button>
        )}
      </div>

      {visibleApplications.length > 0 ? (
        <div className="space-y-4">
          {visibleApplications.map((application) => (
            <ApplicationReviewCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <h2 className="mt-4 font-bold">No matching applicants</h2>
          <p className="mt-1 text-sm text-muted-foreground">Try a different name, email, phone, roll number, or status.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setFilter("ALL") }}
            className="mt-4 text-sm font-bold text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  )
}
