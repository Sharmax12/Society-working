"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { hasSocietyAdminAccess } from "@/modules/auth/authorization"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Only allow http(s) links for admin-supplied URLs — these get rendered
// as <img src> / <a href> for every visitor, so reject executable schemes.
function assertSafeUrl(value: string, label: string) {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`${label} must be a valid URL`)
  }
  if (
    (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
    !parsed.hostname ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error(`${label} must be a valid http:// or https:// link`)
  }
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function assertLength(value: string, max: number, label: string) {
  if (value.length > max) throw new Error(`${label} must be ${max} characters or fewer`)
}

// Read the current identity and derive the access scope on the server.
// Never trust caller-supplied user IDs or an "isGlobalAdmin" boolean in a
// server action: those arguments are under the caller's control.
async function requireEventAdminScope() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authorized")

  const adminId = session.user.id
  const isGlobalAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

  if (!isGlobalAdmin && !(await hasSocietyAdminAccess(adminId))) {
    throw new Error("You are not allowed to manage events")
  }

  return { adminId, isGlobalAdmin }
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

// Societies the signed-in admin manages. The scope comes from their session.
export async function getManagedSocietiesForEvents() {
  const { adminId, isGlobalAdmin } = await requireEventAdminScope()
  return db.society.findMany({
    where: isGlobalAdmin
      ? {}
      : { OR: [{ adminId }, { admins: { some: { userId: adminId } } }] },
    include: { _count: { select: { events: true } } },
    orderBy: { createdAt: "desc" },
  })
}

// Events across societies this admin manages, plus standalone events they created.
export async function getManagedEvents() {
  const { adminId, isGlobalAdmin } = await requireEventAdminScope()
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

  const societyId = readText(formData, "societyId")
  const title = readText(formData, "title")
  const description = readText(formData, "description")
  const date = readText(formData, "date")
  const endDate = readText(formData, "endDate")
  const location = readText(formData, "location")
  const imageUrl = readText(formData, "imageUrl")
  const inviteLink = readText(formData, "inviteLink")

  if (!societyId) throw new Error("Choose a society for this event")
  if (!title) throw new Error("Event title is required")
  if (!description) throw new Error("Description is required")
  assertLength(title, 120, "Event title")
  assertLength(description, 5000, "Event description")
  assertLength(location, 200, "Event location")
  assertLength(imageUrl, 2048, "Photo URL")
  assertLength(inviteLink, 2048, "Invite / RSVP link")

  const parsedDate = parseIndiaDateTime(date)
  const parsedEndDate = endDate ? parseIndiaDateTime(endDate) : null
  if (!parsedDate) throw new Error("A valid event date and time in India is required")
  if (endDate && (!parsedEndDate || parsedEndDate.getTime() <= parsedDate.getTime())) {
    throw new Error("End date and time must be after the start date and time")
  }
  if (imageUrl) assertSafeUrl(imageUrl, "Photo URL")
  if (inviteLink) assertSafeUrl(inviteLink, "Invite / RSVP link")

  // Society admins can post only to their own societies; platform admins can post to any society.
  const isGlobalAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
  const society = await db.society.findFirst({
    where: isGlobalAdmin
      ? { id: societyId }
      : {
          id: societyId,
          OR: [
            { adminId: session.user.id },
            { admins: { some: { userId: session.user.id } } },
          ],
        },
  })
  if (!society) throw new Error("You don't manage this society")

  const event = await db.event.create({
    data: {
      societyId,
      createdById: session.user.id,
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
  revalidatePath("/admin/events")
  redirect(`/events/${event.id}`)
}

export async function createQuickEvent(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN" &&
    !(await hasSocietyAdminAccess(session.user.id))
  ) {
    throw new Error("You are not allowed to create events")
  }

  const organizerName = readText(formData, "organizerName")
  const title = readText(formData, "title")
  const description = readText(formData, "description")
  const date = readText(formData, "date")
  const endDate = readText(formData, "endDate")
  const location = readText(formData, "location")
  const imageUrl = readText(formData, "imageUrl")
  const inviteLink = readText(formData, "inviteLink")

  if (!organizerName) throw new Error("Event host / organiser name is required")
  if (!title) throw new Error("Event title is required")
  if (!description) throw new Error("Description is required")
  assertLength(organizerName, 120, "Event host / organiser name")
  assertLength(title, 120, "Event title")
  assertLength(description, 5000, "Event description")
  assertLength(location, 200, "Event location")
  assertLength(imageUrl, 2048, "Photo URL")
  assertLength(inviteLink, 2048, "Invite / RSVP link")

  const parsedDate = parseIndiaDateTime(date)
  const parsedEndDate = endDate ? parseIndiaDateTime(endDate) : null
  if (!parsedDate) throw new Error("A valid event date and time in India is required")
  if (endDate && (!parsedEndDate || parsedEndDate.getTime() <= parsedDate.getTime())) {
    throw new Error("End date and time must be after the start date and time")
  }
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

  const isGlobalAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
  const event = await db.event.findFirst({
    where: isGlobalAdmin
      ? { id: eventId }
      : {
          id: eventId,
          OR: [
            { createdById: session.user.id, societyId: null },
            {
              society: {
                OR: [
                  { adminId: session.user.id },
                  { admins: { some: { userId: session.user.id } } },
                ],
              },
            },
          ],
        },
  })
  if (!event) throw new Error("Event not found")

  await db.event.delete({ where: { id: eventId } })

  revalidatePath("/events")
  revalidatePath("/admin/events")
}
