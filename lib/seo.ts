/** Site-wide metadata and SEO settings. */
export const siteConfig = {
  name: "HallWayLoop",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.hallwayloop.com",
  marketing: {
    title: "HallWayLoop | College Societies, Clubs & Campus Events",
    description:
      "Discover college societies, student clubs, campus events, and communities in one place. Find opportunities to join, participate, and connect.",
    tagline: "Discover. Belong. Connect. A campus platform for societies, clubs, events, and student communities.",
  },
  app: {
    title: "HallWayLoop",
    titleTemplate: "%s | HallWayLoop",
    description:
      "Discover college societies, student clubs, campus events, and communities in one place.",
  },
  keywords: [
    "HallWayLoop",
    "college societies",
    "college clubs",
    "student clubs",
    "student communities",
    "campus events",
    "college events",
    "university societies",
    "join college clubs",
    "student networking",
    "campus community platform",
  ],
  ogImage: "/icon.svg",
  locale: "en_IN",
  contactEmail: "info@hallwayloop.com",
  author: "Aniruddh Sharma",
  social: { github: "https://github.com/Sharmax12/Society-working" },
} as const;

export const robotsConfig = {
  allow: ["/"],
  disallow: ["/dashboard", "/admin", "/apply", "/auth", "/api"],
} as const;

export const staticSitemapRoutes: {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/societies", changeFrequency: "daily", priority: 0.9 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/Connect", changeFrequency: "weekly", priority: 0.6 },
];

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.marketing.tagline,
    alternateName: "HallWayLoop",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "en-IN",
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.url + "/icon.svg",
    email: siteConfig.contactEmail,
    sameAs: [siteConfig.social.github],
  };
}
