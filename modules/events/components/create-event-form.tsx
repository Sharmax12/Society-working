"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createEvent } from "@/modules/events/admin-queries"
import { toast } from "sonner"
import { CalendarDays, Image as ImageIcon, Link2, MapPin, Send, Sparkles } from "lucide-react"

type Society = { id: string; name: string }

export function CreateEventForm({ societies }: { societies: Society[] }) {
  const [isPending, startTransition] = useTransition()
  function handleSubmit(formData: FormData) { startTransition(async () => { try { await createEvent(formData) } catch (err) { toast.error(err instanceof Error ? err.message : "Something went wrong") } }) }
  const input = "mt-2 w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
  return <form action={handleSubmit} className="space-y-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <div><label className="text-sm font-semibold">Society</label><select name="societyId" required defaultValue="" className={`${input} bg-background`}><option value="" disabled>Select a society</option>{societies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
      <div><label className="text-sm font-semibold">Event title</label><input name="title" required className={input} placeholder="e.g. Annual Tech Fest" /></div>
    </div>
    <div><label className="text-sm font-semibold">Description</label><textarea name="description" required rows={5} className={`${input} resize-y`} placeholder="What&apos;s happening? Give students a reason to show up." /></div>
    <div className="rounded-2xl border bg-muted/20 p-4 sm:p-5"><div className="mb-4 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><CalendarDays className="h-4 w-4" /></div><div><p className="font-bold">When & where</p><p className="text-xs text-muted-foreground">Make the event easy to plan for.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="text-sm font-semibold">Date & time</label><input name="date" type="datetime-local" required className={input} /></div><div><label className="text-sm font-semibold">Location</label><div className="relative"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input name="location" className={`${input} pl-10`} placeholder="e.g. Main Auditorium" /></div></div></div></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><label className="flex items-center gap-2 text-sm font-semibold"><ImageIcon className="h-4 w-4 text-primary" /> Photo URL</label><input name="imageUrl" type="url" className={input} placeholder="https://..." /><p className="mt-1.5 text-xs text-muted-foreground">Optional poster or banner image.</p></div><div><label className="flex items-center gap-2 text-sm font-semibold"><Link2 className="h-4 w-4 text-primary" /> RSVP / invite link</label><input name="inviteLink" type="url" className={input} placeholder="https://forms.gle/..." /><p className="mt-1.5 text-xs text-muted-foreground">Optional registration or community invite.</p></div></div>
    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-accent" /> Visible on the public Events page</div><Button type="submit" variant="brand" disabled={isPending} className="h-11 rounded-xl px-6">{isPending ? "Publishing..." : "Publish event"}<Send className="h-4 w-4" /></Button></div>
  </form>
}
