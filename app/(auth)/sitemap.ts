import type { MetadataRoute } from "next";
import { getUpcomingEvents } from "@/modules/events/queries";
import { getSocietiesForDirectory } from "@/modules/societies/queries";
import { siteConfig, staticSitemapRoutes } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let societies: Awaited<ReturnType<typeof getSocietiesForDirectory>> = [];
  let events: Awaited<ReturnType<typeof getUpcomingEvents>> = [];

  try {
    [societies, events] = await Promise.all([
      getSocietiesForDirectory(),
      getUpcomingEvents(),
    ]);
  } catch (error) {
    console.error("Unable to load database-backed sitemap entries", error);
  }

  const societyEntries: MetadataRoute.Sitemap = societies.map((society) => ({
    url: \${siteConfig.url}/societies/\${society.id},
    lastModified: society.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: \${siteConfig.url}/events/\${event.id},
    lastModified: event.updatedAt,
    changeFrequency: "daily",
    priority: 0.75,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticSitemapRoutes.map((route) => ({
    url: \${siteConfig.url}\${route.path},
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...societyEntries, ...eventEntries];
}
