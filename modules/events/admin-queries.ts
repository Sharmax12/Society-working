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

// datetime-local inputs have no timezone marker. Treat the entered wall-clock
// time as Asia/Kolkata, then store the equivalent UTC instant.
function parseIndiaDateTime(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const second = Number(match[6] ?? 0)
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  const check = new Date(wallClockAsUtc)

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    check.getUTCHours() !== hour ||
    check.getUTCMinutes() !== minute ||
    check.getUTCSeconds() !== second
  ) {
    return null
  }

  return new Date(wallClockAsUtc - 330 * 60 * 1000)
}

// Societies the current admin manages, with how many events each has —
// used to pick which society an event belongs to.
export async function getManagedSocietiesForEvents(adminId: string, isGlobalAdmin = false) {
  return db.society.findMany({
    where: isGlobalAdmin ? {} : { OR: [{ adminId }, { admins: { some: { userId: adminId } } }] },
    include: { _count: { select: { events: true } } },
    orderBy: { createdAt: "desc" },
  })
}

// Events across societies this admin manages, plus standalone events they created.
// Platform admins can manage all events; society admins stay scoped to their own work.
export async function getManagedEvents(adminId: string, isGlobalAdmin = false) {
  return db.event.findMany({
    where: isGlobalAdmin
      ? {}
      : {
          OR: [
            { society: { OR: [{ adminId }, { admins: { some: { userId: adminId } } }] } },
            { societyId: null, createdById: adminId },
          ],
        },
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
  const endDate = String(formData.get("endDate") ?? "").trim()
  const location = formData.get("location") as string
  const imageUrl = formData.get("imageUrl") as string
  const inviteLink = formData.get("inviteLink") as string

  if (!societyId) throw new Error("Choose a society for this event")
  if (!title?.trim()) throw new Error("Event title is required")
  if (!description?.trim()) throw new Error("Description is required")
  const parsedDate = parseIndiaDateTime(date)
  const parsedEndDate = endDate ? parseIndiaDateTime(endDate) : null
  if (!parsedDate) throw new Error("A valid event date and time in India is required")
  if (endDate && (!parsedEndDate || parsedEndDate.getTime() <= parsedDate.getTime())) throw new Error("End date and time must be after the start date and time")
  if (imageUrl?.trim()) assertSafeUrl(imageUrl.trim(), "Photo URL")
  if (inviteLink?.trim()) assertSafeUrl(inviteLink.trim(), "Invite / RSVP link")

  // Society admins can post only to their own societies; platform admins can post to any society.
  const isGlobalAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
  const society = await db.society.findFirst({
    where: isGlobalAdmin
      ? { id: societyId }
      : { id: societyId, OR: [{ adminId: session.user.id }, { admins: { some: { userId: session.user.id } } }] },
  })
  if (!society) throw new Error("You don't manage this society")

  const event = await db.event.create({
    data: {
      societyId,
      createdById: session.user.id,
      title: title.trim(),
      description: description.trim(),
      date: parsedDate,
      endDate: parsedEndDate ?? undefined,
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
    throw new Error("You are not allowed to create events")
  }

  const organizerName = String(formData.get("organizerName") ?? "").trim().slice(0, 120)
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "")
  const endDate = String(formData.get("endDate") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const inviteLink = String(formData.get("inviteLink") ?? "").trim()

  if (!organizerName) throw new Error("Event host / organiser name is required")
  if (!title) throw new Error("Event title is required")
  if (!description) throw new Error("Description is required")
  const parsedDate = parseIndiaDateTime(date)
  const parsedEndDate = endDate ? parseIndiaDateTime(endDate) : null
  if (!parsedDate) throw new Error("A valid event date and time in India is required")
  if (endDate && (!parsedEndDate || parsedEndDate.getTime() <= parsedDate.getTime())) throw new Error("End date and time must be after the start date and time")
  if (imageUrl) assertSafeUrl(imageUrl, "Photo URL")
  if (inviteLink) assertSafeUrl(inviteLink, "Invite / RSVP link")

  const event = await db.event.create({
    data: {
      societyId: null,
      createdById: session.user.id,
      organizerName,
      title,
      description,
      date: parsedDate,
      endDate: parsedEndDate ?? undefined,
      location: location || undefined,
      imageUrl: imageUrl || undefined,
      inviteLink: inviteLink || undefined,
    },
  })

  revalidatePath("/events")
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/events")
  redirect(`/events/${event.id}`)
}

export async function deleteEvent(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  const isGlobalAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
  const event = await db.event.findFirst({
    where: isGlobalAdmin
      ? { id: eventId }
      : {
          id: eventId,
          OR: [
            { createdById: session.user.id, societyId: null },
            { society: { OR: [{ adminId: session.user.id }, { admins: { some: { userId: session.user.id } } }] } },
          ],
        },
  })
  if (!event) throw new Error("Event not found")

  await db.event.delete({ where: { id: eventId } })

  revalidatePath("/events")
  revalidatePath("/admin/events")
}
