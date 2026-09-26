"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createEvent } from "@/modules/events/admin-queries"
import { toast } from "sonner"

type Society = { id: string; name: string }

export function CreateEventForm({ societies }: { societies: Society[] }) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createEvent(formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium">Society</label>
        <select
          name="societyId"
          required
          defaultValue=""
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="" disabled>
            Select a society
          </option>
          {societies.map((society) => (
            <option key={society.id} value={society.id}>
              {society.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Event title</label>
        <input
          name="title"
          required
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          placeholder="e.g. Annual Tech Fest"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          placeholder="What's happening at this event?"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Date & time</label>
          <input
            name="date"
            type="datetime-local"
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            name="location"
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Main Auditorium"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Photo URL</label>
        <input
          name="imageUrl"
          type="url"
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Link to a poster or banner image. Upload it somewhere (e.g. Imgur,
          your college drive) and paste the link here.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Invite / RSVP link</label>
        <input
          name="inviteLink"
          type="url"
          className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          placeholder="https://forms.gle/... or WhatsApp/Discord invite"
        />
      </div>

      <Button type="submit" variant="brand" disabled={isPending}>
        {isPending ? "Publishing..." : "Publish event"}
      </Button>
    </form>
  )
}
