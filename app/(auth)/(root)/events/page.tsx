import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { getUpcomingEvents, getPastEvents } from "@/modules/events/queries";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Events",
  description:
    "See what's coming up across every society on HallWayLoop — fests, workshops, and meetups.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | HallWayLoop",
    description:
      "See what's coming up across every society on HallWayLoop — fests, workshops, and meetups.",
    url: "/events",
  },
};

export const revalidate = 3600;

function formatEventDate(date: Date) { return new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return <main className="min-h-screen bg-background">
    <section className="border-b bg-gradient-to-b from-orange-500/[.07] via-background to-background"><div className="mx-auto max-w-6xl px-6 pb-14 pt-16"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-orange-500"><Sparkles className="h-4 w-4" /> What's happening</div><h1 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-6xl">Your campus, <span className="text-orange-500">in motion.</span></h1><p className="mt-4 max-w-2xl text-muted-foreground">Fests, workshops, competitions and meetups from the societies shaping campus life.</p></div></section>
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6"><h2 className="text-xl font-bold">Upcoming events</h2><p className="text-sm text-muted-foreground">Don't just hear about it. Be there.</p></div>
      {upcoming.length === 0 ? <div className="rounded-3xl border border-dashed p-14 text-center text-muted-foreground">No upcoming events right now — check back soon.</div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{upcoming.map((event) => <Link key={event.id} href={`/events/${event.id}`} className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">{event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="flex aspect-[16/9] items-end bg-gradient-to-br from-orange-500/15 via-rose-500/10 to-transparent p-5"><CalendarDays className="h-9 w-9 text-orange-500" /></div>}<div className="p-6"><div className="flex items-start justify-between gap-3"><Badge variant="secondary">{event.society.name}</Badge><ArrowUpRight className="h-5 w-5 text-muted-foreground" /></div><h3 className="mt-4 text-xl font-bold tracking-tight">{event.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{event.description}</p><div className="mt-5 space-y-2 text-xs text-muted-foreground"><div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{formatEventDate(event.date)}</div>{event.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>}</div></div></Link>)}</div>}
      {past.length > 0 && <section className="mt-16"><h2 className="mb-5 text-xl font-bold">Past events</h2><div className="grid gap-3 md:grid-cols-2">{past.map(event => <Link key={event.id} href={`/events/${event.id}`} className="flex items-center justify-between rounded-2xl border p-4 transition-colors hover:border-orange-300"><div><p className="font-semibold">{event.title}</p><p className="mt-1 text-xs text-muted-foreground">{event.society.name} · {formatEventDate(event.date)}</p></div><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></Link>)}</div></section>}
    </div>
  </main>;
}
