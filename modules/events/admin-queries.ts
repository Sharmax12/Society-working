"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Societies the current admin manages, with how many events each has —
// used to pick which society an event belongs to.
export async function getManagedSocietiesForEvents(adminId: string) {
  return db.society.findMany({
    where: { adminId },
    include: { _count: { select: { events: true } } },
    orderBy: { createdAt: "desc" },
  })
}

// All events (past + upcoming) across the societies this admin manages.
export async function getManagedEvents(adminId: string) {
  return db.event.findMany({
    where: { society: { adminId } },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  })
}

export async function createEvent(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") throw new Error("Not authorized")

  const societyId = formData.get("societyId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const location = formData.get("location") as string
  const imageUrl = formData.get("imageUrl") as string
  const inviteLink = formData.get("inviteLink") as string

  if (!societyId) throw new Error("Choose a society for this event")
  if (!title?.trim()) throw new Error("Event title is required")
  if (!description?.trim()) throw new Error("Description is required")
  if (!date) throw new Error("Event date is required")

  // Make sure this admin actually manages the society they're posting to.
  const society = await db.society.findFirst({
    where: { id: societyId, adminId: session.user.id },
  })
  if (!society) throw new Error("You don't manage this society")

  const event = await db.event.create({
    data: {
      societyId,
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      location: location?.trim() || undefined,
      imageUrl: imageUrl?.trim() || undefined,
      inviteLink: inviteLink?.trim() || undefined,
    },
  })

  revalidatePath("/events")
  revalidatePath("/admin/events")
  redirect(`/events/${event.id}`)
}

export async function deleteEvent(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") throw new Error("Not authorized")

  const event = await db.event.findFirst({
    where: { id: eventId, society: { adminId: session.user.id } },
  })
  if (!event) throw new Error("Event not found")

  await db.event.delete({ where: { id: eventId } })

  revalidatePath("/events")
  revalidatePath("/admin/events")
}
