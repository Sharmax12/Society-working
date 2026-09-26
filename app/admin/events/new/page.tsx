import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getManagedSocietiesForEvents } from "@/modules/events/admin-queries"
import { CreateEventForm } from "@/modules/events/components/create-event-form"

export default async function NewEventPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const societies = await getManagedSocietiesForEvents(session.user.id)

  if (societies.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Create an event</h1>
        <p className="text-muted-foreground mt-4">
          You need to{" "}
          <Link href="/admin/societies/new" className="text-rose-600 hover:underline">
            create a society
          </Link>{" "}
          before you can post events.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Create an event</h1>
      <p className="text-muted-foreground mt-1 mb-8">
        Publish an event listing with a photo and invite link — it'll be
        visible to everyone on the public Events page.
      </p>
      <CreateEventForm societies={societies} />
    </div>
  )
}
