"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageCircle, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"

type Person = { id: string; name: string | null; image: string | null; rollNumber: string | null }
type Conversation = {
  id: string
  updatedAt: string
  user: Person
  lastMessage: { content: string; senderId: string; createdAt: string; readAt: string | null } | null
}

function name(person: Person) { return person.name?.trim() || "HWL student" }
function initials(person: Person) { return name(person).split(/\s+/).slice(0,2).map(x => x[0]?.toUpperCase()).join("") }

export function MessagesClient() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Unable to load messages.")
      setConversations(data.conversations ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load messages.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const filtered = conversations.filter((conversation) =>
    name(conversation.user).toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary/[0.1] via-card to-accent/[0.08] p-6 shadow-sm sm:p-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-primary">HWL Messages</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">Keep the conversation going.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Private conversations with people you&apos;ve connected with.
            </p>
          </div>
        </div>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search conversations..." className="h-11 w-full rounded-xl border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">{error}</div> : null}

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border bg-card shadow-sm">
          {loading ? [1,2,3].map(i => <div key={i} className="h-20 animate-pulse border-b bg-muted/20" />) :
            filtered.length ? filtered.map(conversation => (
              <button key={conversation.id} type="button" onClick={() => router.push(`/messages/${conversation.id}`)} className="flex w-full items-center gap-3 border-b p-4 text-left transition last:border-b-0 hover:bg-muted/40 sm:p-5">
                {conversation.user.image ? <img src={conversation.user.image} alt="" className="h-12 w-12 shrink-0 rounded-2xl object-cover" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-sm font-black text-primary">{initials(conversation.user)}</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-black">{name(conversation.user)}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{conversation.lastMessage?.content ?? "Start a conversation."}</p>
                </div>
              </button>
            )) :
            <div className="p-14 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><MessageCircle className="h-6 w-6" /></div>
              <p className="mt-4 font-black">{query ? "No conversations found." : "No conversations yet."}</p>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">Connect with someone first, then start your first conversation.</p>
              <button type="button" onClick={() => router.push("/connect")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground"><Users className="h-4 w-4" /> Find people</button>
            </div>
          }
        </section>
      </div>
    </main>
  )
}
