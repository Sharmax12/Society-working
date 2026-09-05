import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { getUpcomingEvents, getPastEvents } from "@/modules/events/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Events</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Fests, workshops, and meetups hosted by societies across campus.
        </p>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No upcoming events right now — check back soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {upcoming.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md py-0 gap-0">
                {event.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-supplied,
                  // arbitrary external URLs, not worth whitelisting remote domains for.
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full aspect-video object-cover bg-muted"
                  />
                )}
                <CardHeader className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {event.society.name}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-5">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight mb-6">
            Past events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="border rounded-xl p-4 hover:border-rose-300 transition-colors opacity-80 hover:opacity-100"
              >
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.society.name} · {formatEventDate(event.date)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
