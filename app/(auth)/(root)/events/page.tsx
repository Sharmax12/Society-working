import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { getUpcomingEvents, getPastEvents } from "@/modules/events/queries";
import { Badge } from "@/components/ui/badge";
import { siteConfig, buildOrganizationJsonLd } from "@/lib/seo";

const eventsDescription =
  "Discover college events, workshops, competitions, meetups, and student activities on HallWayLoop.";

export const metadata: Metadata = {
  title: "Campus Events",
  description: eventsDescription,
  keywords: ["campus events", "college events", "student events", "university events"],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Campus Events | HallWayLoop",
    description: eventsDescription,
    url: "/events",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Discover campus events on HallWayLoop" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Events | HallWayLoop",
    description: eventsDescription,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};
export const revalidate = 3600;

function formatEventDate(date: Date) {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Campus Events",
    itemListElement: upcoming.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: event.title,
      url: siteConfig.url + "/events/" + event.id,
    })),
  };
  const eventJsonLd = upcoming.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": siteConfig.url + "/events/" + event.id + "#event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    ...(event.endDate ? { endDate: event.endDate.toISOString() } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    url: siteConfig.url + "/events/" + event.id,
    ...(event.imageUrl ? { image: event.imageUrl } : {}),
    ...(event.location ? { location: { "@type": "Place", name: event.location } } : {}),
    organizer: {
      "@type": "Organization",
      name: event.society?.name ?? "HallWayLoop Community",
      ...(event.society ? { url: siteConfig.url + "/societies/" + event.society.id } : {}),
    },
  }));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url + "/" },
      { "@type": "ListItem", position: 2, name: "Events", item: siteConfig.url + "/events" },
    ],
  };
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Campus calendar</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-.055em] sm:text-7xl">Good things happen <span className="text-muted-foreground">when you show up.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Discover workshops, competitions, meetups and activities happening across your campus.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {past.length > 0 && (
          <section aria-labelledby="past-events-heading" className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">From the campus archive</p>
            <h2 id="past-events-heading" className="mt-2 text-2xl font-semibold tracking-tight">Good times, already had</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {past.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="group flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium group-hover:text-primary">{event.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.society?.name ?? "Community event"} · {formatEventDate(event.date)}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="upcoming-events-heading">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">The calendar</p>
              <h2 id="upcoming-events-heading" className="mt-2 text-2xl font-semibold tracking-tight">
                What’s coming up {upcoming.length > 0 && <span className="ml-2 text-sm font-normal text-muted-foreground">{upcoming.length}</span>}
              </h2>
            </div>
          </div>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-4 font-semibold">No upcoming events right now.</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Event listings will appear here as campus organisers publish them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {upcoming.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="group grid gap-5 py-6 transition sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <div className="overflow-hidden rounded-xl bg-muted">
                    {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center"><CalendarDays className="h-7 w-7 text-muted-foreground" /></div>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary" className="rounded-full font-medium">{event.society?.name ?? event.organizerName ?? "Community event"}</Badge><span className="text-xs text-muted-foreground">{formatEventDate(event.date)}{event.endDate ? ` – ${formatEventDate(event.endDate)}` : ""}</span></div>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight transition group-hover:text-primary">{event.title}</h3>
                    <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{event.description}</p>
                    {event.location && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{event.location}</p>}
                  </div>
                  <ArrowUpRight className="hidden h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
