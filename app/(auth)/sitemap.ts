import type { MetadataRoute } from "next";
import { getOpenSocieties } from "@/modules/societies/queries";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://campuscircle.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const societies = await getOpenSocieties();

  const societyEntries: MetadataRoute.Sitemap = societies.map((society) => ({
    url: `${SITE_URL}/societies/${society.id}`,
    lastModified: society.updatedAt,
    changeFrequency: "weekly",
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
    ...societyEntries,
  ];
}
