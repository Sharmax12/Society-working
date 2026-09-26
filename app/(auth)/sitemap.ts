import type { MetadataRoute } from "next";
import { getOpenSocieties } from "@/modules/societies/queries";
import { getUpcomingEvents } from "@/modules/events/queries";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [societies, events] = await Promise.all([
    getOpenSocieties(),
    getUpcomingEvents(),
  ]);

  const societyEntries: MetadataRoute.Sitemap = societies.map((society) => ({
    url: `${SITE_URL}/societies/${society.id}`,
    lastModified: society.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/societies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...societyEntries,
    ...eventEntries,
  ];
}
