import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { getUpcomingEvents, getPastEvents } from "@/modules/events/queries";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Campus Events",
  description: "Discover college events, workshops, competitions, meetups, and student activities on HallWayLoop.",
  keywords: ["campus events", "college events", "student events", "university events"],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Campus Events | HallWayLoop",
    description: "Discover college events, workshops, competitions, meetups, and student activities.",
    url: "/events",
    siteName: "HallWayLoop",
    type: "website",
  },
};
export const revalidate = 3600;
function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Campus Events",
    itemListElement: upcoming.map((event, index) => ({ "@type": "ListItem", position: index + 1, name: event.title, url: siteConfig.url + "/events/" + event.id })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url + "/" },
      { "@type": "ListItem", position: 2, name: "Events", item: siteConfig.url + "/events" },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Campus calendar</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-.055em] sm:text-7xl">Good things happen <span className="text-muted-foreground">when you show up.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Discover workshops, competitions, meetups and activities happening across your campus.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">The calendar</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Coming up <span className="ml-2 text-sm font-normal text-muted-foreground">{upcoming.length}</span></h2></div>
        </div>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-4 font-medium">Nothing on the calendar yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon for the next campus opportunity.</p>
          </div>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {upcoming.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group grid gap-5 py-6 transition sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <div className="overflow-hidden rounded-xl bg-muted">
                  {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center"><CalendarDays className="h-7 w-7 text-muted-foreground" /></div>}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary" className="rounded-full font-medium">{event.society.name}</Badge><span className="text-xs text-muted-foreground">{formatEventDate(event.date)}</span></div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight transition group-hover:text-primary">{event.title}</h3>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{event.description}</p>
                  {event.location && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{event.location}</p>}
                </div>
                <ArrowUpRight className="hidden h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
              </Link>
            ))}
          </div>
        )}
        {past.length > 0 && <section className="mt-16"><h2 className="text-xl font-semibold tracking-tight">Past events</h2><div className="mt-4 divide-y divide-border border-y border-border">{past.map(event => <Link key={event.id} href={`/events/${event.id}`} className="flex items-center justify-between gap-4 py-4 group"><div><p className="font-medium group-hover:text-primary">{event.title}</p><p className="mt-1 text-xs text-muted-foreground">{event.society.name} · {formatEventDate(event.date)}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" /></Link>)}</div></section>}
      </div>
    </main>
  );
}
