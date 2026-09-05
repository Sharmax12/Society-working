import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";

import { getEvent } from "@/modules/events/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Event not found" };
  }

  const description = event.description.slice(0, 155);

  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${event.id}` },
    openGraph: {
      title: `${event.title} | HallWayLoop`,
      description,
      url: `/events/${event.id}`,
      type: "article",
      ...(event.imageUrl ? { images: [event.imageUrl] } : {}),
    },
    twitter: {
      card: event.imageUrl ? "summary_large_image" : "summary",
      title: `${event.title} | HallWayLoop`,
      description,
    },
  };
}

function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    ...(event.location ? { location: { "@type": "Place", name: event.location } } : {}),
    organizer: { "@type": "Organization", name: event.society.name },
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {event.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full aspect-video object-cover rounded-xl mb-8 bg-muted"
        />
      )}

      <Link href={`/societies/${event.society.id}`}>
        <Badge variant="secondary" className="mb-3">
          {event.society.name}
        </Badge>
      </Link>

      <h1 className="text-4xl font-extrabold tracking-tight">
        {event.title}
      </h1>

      <p className="text-muted-foreground mt-4 leading-relaxed whitespace-pre-line">
        {event.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
        <CalendarDays className="w-4 h-4" />
        <span>{formatEventDate(event.date)}</span>
      </div>

      {event.location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      )}

      {event.inviteLink && (
        <div className="mt-8">
          <a href={event.inviteLink} target="_blank" rel="noopener noreferrer">
            <Button variant="brand" size="lg">
              RSVP / Join
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      )}

      <Link
        href="/events"
        className="inline-block mt-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to all events
      </Link>
    </div>
  );
}
