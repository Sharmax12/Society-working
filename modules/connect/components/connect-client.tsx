"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { Ban, Check, Clock3, Search, UserPlus, Users, X } from "lucide-react"

type Person = {
  id: string
  name: string | null
  image: string | null
  rollNumber: string | null
}

type Request = {
  id: string
  createdAt: string
  user: Person
}

type Connection = {
  id: string
  connectedAt: string
  user: Person
}

type Tab = "discover" | "requests" | "connections"

function displayName(person: Person) {
  return person.name?.trim() || "HWL student"
}

function initials(person: Person) {
  return displayName(person)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function Avatar({ person }: { person: Person }) {
  return person.image ? (
    <img
      src={person.image}
      alt=""
      className="h-12 w-12 rounded-2xl object-cover"
    />
  ) : (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
      {initials(person)}
    </div>
  )
}

export function ConnectClient() {
  const [tab, setTab] = useState<Tab>("discover")
  const [suggestions, setSuggestions] = useState<Person[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const [suggestionsResponse, requestsResponse, connectionsResponse] =
        await Promise.all([
          fetch("/api/connections/suggestions"),
          fetch("/api/connections/requests"),
          fetch("/api/connections"),
        ])

      if (
        !suggestionsResponse.ok ||
        !requestsResponse.ok ||
        !connectionsResponse.ok
      ) {
        throw new Error("Unable to load Connect right now.")
      }

      const [suggestionsData, requestsData, connectionsData] =
        await Promise.all([
          suggestionsResponse.json(),
          requestsResponse.json(),
          connectionsResponse.json(),
        ])

      setSuggestions(suggestionsData.suggestions ?? [])
      setRequests(requestsData.requests ?? [])
      setConnections(connectionsData.connections ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function sendRequest(recipientId: string) {
    setBusyId(recipientId)
    setError("")

    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send the request.")
      }

      setSuggestions((current) => current.filter((person) => person.id !== recipientId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the request.")
    } finally {
      setBusyId(null)
    }
  }

  async function respond(connectionId: string, action: "accept" | "reject" | "block") {
    setBusyId(connectionId)
    setError("")

    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update the request.")
      }

      setRequests((current) =>
        current.filter((request) => request.id !== connectionId),
      )

      if (action === "accept") {
        await load()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update the request.")
    } finally {
      setBusyId(null)
    }
  }

  const filteredSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return suggestions

    return suggestions.filter((person) => {
      const name = displayName(person).toLowerCase()
      const roll = person.rollNumber?.toLowerCase() ?? ""
      return name.includes(query) || roll.includes(query)
    })
  }, [search, suggestions])

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: "discover", label: "Discover" },
    { id: "requests", label: "Requests", count: requests.length },
    { id: "connections", label: "Connections", count: connections.length },
  ]

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.1] via-card to-accent/[0.08] p-6 shadow-sm sm:p-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-primary">
              HWL Connect
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">
              Meet people who make campus interesting.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Find students, build genuine connections, and make the next
              conversation easier to start.
            </p>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border bg-card p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  tab === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {typeof item.count === "number" && item.count > 0 ? (
                  <span className="ml-2 rounded-full bg-background/70 px-2 py-0.5 text-[10px]">
                    {item.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {tab === "discover" ? (
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                className="h-11 w-full rounded-xl border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        ) : null}

        <section className="mt-6">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-[1.5rem] border bg-card"
                />
              ))}
            </div>
          ) : tab === "discover" ? (
            filteredSuggestions.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredSuggestions.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    busy={busyId === person.id}
                    onConnect={() => void sendRequest(person.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title={search ? "No students found." : "You're all caught up."}
                description={
                  search
                    ? "Try a different name or roll number."
                    : "New students will appear here as the HWL community grows."
                }
              />
            )
          ) : tab === "requests" ? (
            requests.length ? (
              <div className="space-y-3">
                {requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    busy={busyId === request.id}
                    onAccept={() => void respond(request.id, "accept")}
                    onReject={() => void respond(request.id, "reject")}
                    onBlock={() => void respond(request.id, "block")}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Clock3 className="h-6 w-6" />}
                title="No pending requests."
                description="Connection requests from other students will appear here."
              />
            )
          ) : connections.length ? (
            <div className="space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between gap-4 rounded-[1.5rem] border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar person={connection.user} />
                    <div className="min-w-0">
                      <p className="truncate font-black">
                        {displayName(connection.user)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {connection.user.rollNumber || "HWL student"}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<UserPlus className="h-6 w-6" />}
              title="No connections yet."
              description="Start by discovering someone from your campus."
              action={() => setTab("discover")}
            />
          )}
        </section>
      </div>
    </main>
  )
}

function PersonCard({
  person,
  busy,
  onConnect,
}: {
  person: Person
  busy: boolean
  onConnect: () => void
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-[1.5rem] border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar person={person} />
        <div className="min-w-0">
          <p className="truncate font-black">{displayName(person)}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {person.rollNumber || "HWL student"}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onConnect}
        className="shrink-0 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-black text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Sending..." : "Connect"}
      </button>
    </article>
  )
}

function RequestCard({
  request,
  busy,
  onAccept,
  onReject,
  onBlock,
}: {
  request: Request
  busy: boolean
  onAccept: () => void
  onReject: () => void
  onBlock: () => void
}) {
  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar person={request.user} />
        <div className="min-w-0">
          <p className="truncate font-black">{displayName(request.user)}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {request.user.rollNumber || "HWL student"} wants to connect with you.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onReject}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-black transition hover:bg-muted disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Decline
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onBlock}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/20 px-3.5 py-2.5 text-xs font-black text-destructive transition hover:bg-destructive/5 disabled:opacity-50"
        >
          <Ban className="h-3.5 w-3.5" />
          Block
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onAccept}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-black text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </button>
      </div>
    </article>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: () => void
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed bg-card/60 p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="mt-4 font-black">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? (
        <button
          type="button"
          onClick={action}
          className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground"
        >
          Discover students
        </button>
      ) : null}
    </div>
  )
}
