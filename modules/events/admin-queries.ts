"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Only allow http(s) links for admin-supplied URLs — these get rendered
// as <img src> / <a href> for every visitor, so reject schemes like
// "javascript:" that could otherwise run in a viewer's browser.
function assertSafeUrl(value: string, label: string) {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`${label} must be a valid URL`)
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label} must be an http:// or https:// link`)
  }
}

// Societies the current admin manages, with how many events each has —
// used to pick which society an event belongs to.
export async function getManagedSocietiesForEvents(adminId: string) {
  return db.society.findMany({
    where: { OR: [{ adminId }, { admins: { some: { userId: adminId } } }] },
    include: { _count: { select: { events: true } } },
    orderBy: { createdAt: "desc" },
  })
}

// All events (past + upcoming) across the societies this admin manages.
export async function getManagedEvents(adminId: string) {
  return db.event.findMany({
    where: { OR: [{ society: { OR: [{ adminId }, { admins: { some: { userId: adminId } } }] } }, { societyId: null }] },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  })
}

export async function createEvent(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
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
  if (imageUrl?.trim()) assertSafeUrl(imageUrl.trim(), "Photo URL")
  if (inviteLink?.trim()) assertSafeUrl(inviteLink.trim(), "Invite / RSVP link")

  // Make sure this admin actually manages the society they're posting to.
  const society = await db.society.findFirst({
    where: { id: societyId, OR: [{ adminId: session.user.id }, { admins: { some: { userId: session.user.id } } }] },
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

export async function createQuickEvent(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const { hasSocietyAdminAccess } = await import("@/modules/auth/authorization")
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && !(await hasSocietyAdminAccess(session.user.id))) {
    throw new Error("You are not allowed to create standalone events")
  }

  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "")
  const location = String(formData.get("location") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const inviteLink = String(formData.get("inviteLink") ?? "").trim()

  if (!title) throw new Error("Event title is required")
  if (!description) throw new Error("Description is required")
  if (!date || Number.isNaN(new Date(date).getTime())) throw new Error("A valid event date is required")
  if (imageUrl) assertSafeUrl(imageUrl, "Photo URL")
  if (inviteLink) assertSafeUrl(inviteLink, "Invite / RSVP link")

  const event = await db.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location: location || undefined,
      imageUrl: imageUrl || undefined,
      inviteLink: inviteLink || undefined,
    },
  })

  revalidatePath("/events")
  revalidatePath("/admin")
  revalidatePath("/admin/events")
  redirect(`/events/${event.id}`)
}

export async function deleteEvent(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const event = await db.event.findFirst({
    where: { id: eventId, society: { OR: [{ adminId: session.user.id }, { admins: { some: { userId: session.user.id } } }] } },
  })
  if (!event) throw new Error("Event not found")

  await db.event.delete({ where: { id: eventId } })

  revalidatePath("/events")
  revalidatePath("/admin/events")
}
