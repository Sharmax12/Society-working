"use server"
import { db } from "@/lib/db"

// Events happening now or in the future, soonest first.
export async function getUpcomingEvents() {
  return db.event.findMany({
    where: { date: { gte: new Date() } },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  })
}

// Events that have already happened, most recent first — kept around so
// the page isn't empty between event seasons and to show activity history.
export async function getPastEvents() {
  return db.event.findMany({
    where: { date: { lt: new Date() } },
    include: { society: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
    take: 12,
  })
}

export async function getEvent(eventId: string) {
  return db.event.findUnique({
    where: { id: eventId },
    include: { society: { select: { id: true, name: true } } },
  })
}
