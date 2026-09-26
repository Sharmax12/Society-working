/**
 * Site-wide metadata and SEO settings.
 *
 * Keep public-facing site details here so titles, descriptions, social cards,
 * robots rules, and the footer stay in sync.
 */
export const siteConfig = {
  name: "HallWayLoop",

  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app",

  marketing: {
    title: "HallWayLoop — Discover Belong Connect",
    description:
      "Discover, apply, and manage college society applications in one place.",
    tagline:
      "The campus platform for discovering societies, events, people and conversations.",
  },

  app: {
    title: "HallWayLoop — Where Campus Societies Come Alive",
    titleTemplate: "%s | HallWayLoop",
    description:
      "Discover, apply, and manage college society applications in one place.",
  },

  keywords: [
    "campus societies",
    "college clubs",
    "student organizations",
    "club applications",
    "society management",
    "join a college club",
  ],

  ogImage: "/logo.svg",
  locale: "en_US",
  contactEmail: "info@hallwayloop.com",
  author: "Aniruddh Sharma",

  social: {
    github: "https://github.com/Sharmax12",
  },
} as const;

export const robotsConfig = {
  allow: ["/", "/societies"],
  disallow: ["/dashboard", "/admin", "/apply", "/auth", "/api"],
} as const;

export const staticSitemapRoutes: {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/societies", changeFrequency: "daily", priority: 0.9 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
];

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.marketing.tagline,
  };
}
