"use server"
import { db } from "@/lib/db"

// Events happening now or in the future, soonest first.
export async function getUpcomingEvents() {
  return db.event.findMany({
    where: { date: { gte: new Date() }, OR: [{ societyId: null }, { society: { verificationStatus: "VERIFIED" } }] },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  })
}

// Events that have already happened, most recent first — kept around so
// the page isn't empty between event seasons and to show activity history.
export async function getPastEvents() {
  return db.event.findMany({
    where: { date: { lt: new Date() }, OR: [{ societyId: null }, { society: { verificationStatus: "VERIFIED" } }] },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
    take: 12,
  })
}

export async function getEvent(eventId: string) {
  // Match the visibility rules used by the public event directory so that
  // guessing an event ID cannot reveal a pending/suspended society's event.
  return db.event.findFirst({
    where: {
      id: eventId,
      OR: [
        { societyId: null },
        { society: { verificationStatus: "VERIFIED" } },
      ],
    },
    include: { society: { select: { id: true, name: true } } },
  })
}
