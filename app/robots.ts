import type { MetadataRoute } from "next";
import { siteConfig, robotsConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [...robotsConfig.allow],
      disallow: [...robotsConfig.disallow],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
