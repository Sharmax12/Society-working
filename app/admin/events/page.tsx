import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { getManagedEvents } from "@/modules/events/admin-queries"

export default async function AdminEventsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const events = await getManagedEvents(session.user.id)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Events</h1>
      <p className="text-muted-foreground mt-1 mb-8">
        Manage event listings for the societies you run.
      </p>
      <Link
        href="/admin/events/new"
        className="inline-block mt-4 mb-8 text-sm font-medium text-rose-600 hover:underline"
      >
        + Create a new event
      </Link>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No events yet. Create one to let students know what's coming up.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="border rounded-xl p-5 hover:border-rose-300 transition-colors"
            >
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {event.society.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
