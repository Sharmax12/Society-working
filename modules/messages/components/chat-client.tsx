"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"

type Person = { id: string; name: string | null; image: string | null; rollNumber: string | null }
type Message = { id: string; content: string; senderId: string; createdAt: string; readAt: string | null }

function displayName(person: Person) { return person.name?.trim() || "HWL student" }
function initials(person: Person) { return displayName(person).split(/\s+/).slice(0,2).map(x => x[0]?.toUpperCase()).join("") }

export function ChatClient({ conversationId, userId }: { conversationId: string; userId: string }) {
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [conversationResponse, messagesResponse] = await Promise.all([
        fetch(`/api/conversations/${conversationId}`, { cache: "no-store" }),
        fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" }),
      ])
      const conversationData = await conversationResponse.json()
      const messagesData = await messagesResponse.json()
      if (!conversationResponse.ok || !messagesResponse.ok) {
        throw new Error(conversationData.error ?? messagesData.error ?? "Unable to load chat.")
      }
      setPerson(conversationData.conversation.user)
      setMessages(messagesData.messages ?? [])
      void fetch(`/api/conversations/${conversationId}/messages`, { method: "PATCH" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load chat.")
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    const initialTimer = window.setTimeout(() => { void load() }, 0)
    const intervalTimer = window.setInterval(() => { void load(true) }, 4000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(intervalTimer)
    }
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: loading ? "auto" : "smooth" })
  }, [messages, loading])

  async function sendMessage() {
    const trimmed = content.trim()
    if (!trimmed || sending) return
    setSending(true)
    setError("")
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Unable to send message.")
      setMessages(current => [...current, data.message])
      setContent("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-3 py-3 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
          <button type="button" onClick={() => router.push("/messages")} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-muted" aria-label="Back to messages"><ArrowLeft className="h-4 w-4" /></button>
          {person?.image ? <img src={person.image} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-xs font-black text-primary">{person ? initials(person) : "HW"}</div>}
          <div className="min-w-0"><p className="truncate font-black">{person ? displayName(person) : "Loading..."}</p><p className="text-xs text-muted-foreground">{person?.rollNumber || "HWL connection"}</p></div>
        </div>

        {error ? <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}

        <div className="my-3 flex-1 overflow-y-auto rounded-[1.75rem] border bg-card p-4 shadow-sm sm:p-6">
          {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded-2xl bg-muted/50" />)}</div> :
            messages.length ? <div className="space-y-2">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${message.senderId === userId ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted"}`}>
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`mt-1 text-[10px] ${message.senderId === userId ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div> :
            <div className="grid h-full min-h-[50vh] place-items-center text-center"><div><p className="font-black">Start the conversation.</p><p className="mt-1 text-sm text-muted-foreground">Say hello — this is a space for your campus connection.</p></div></div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={e => { e.preventDefault(); void sendMessage() }} className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm">
          <textarea value={content} onChange={e => setContent(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage() } }} maxLength={2000} rows={1} placeholder="Write a message..." className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none" />
          <button type="submit" disabled={sending || !content.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </main>
  )
}
