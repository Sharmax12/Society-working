/**
 * Central SEO / site metadata config.
 *
 * Edit the values below to change how the site appears in browser tabs,
 * search results, social share cards, robots.txt and sitemap.xml. Nothing
 * else in the app should hardcode these strings — import from here instead,
 * so a change only ever needs to happen in one place.
 */

export const siteConfig = {
  /** Display name used in titles, JSON-LD, and the footer. */
  name: "HallWayLoop",

  /**
   * Canonical site URL. Set NEXT_PUBLIC_APP_URL in your environment to
   * override this for staging/production (e.g. https://yourdomain.com).
   * Falls back to the placeholder below when that env var isn't set.
   */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app",

  /**
   * Metadata for the public marketing pages: the homepage, /societies,
   * and /events. These are the pages you actually want indexed by search
   * engines (see `robotsConfig` below).
   */
  marketing: {
    title: "HallWayLoop — Discover Belong Connect",
    description:
      "Discover, apply, and manage college society applications in one place.",
    /** Short one-liner used in the homepage's JSON-LD WebSite entry. */
    tagline:
      "The campus platform for discovering societies, events, people and conversations.",
  },

  /**
   * Fallback metadata for the authenticated app screens (dashboard, admin,
   * apply, sign-in). These pages are set to noindex by default in
   * app/layout.tsx since they're not meant to show up in search results.
   */
  app: {
    title: "HallWayLoop — Where Campus Societies Come Alive",
    /** %s is replaced with a page-specific title, e.g. "Dashboard | HallWayLoop". */
    titleTemplate: "%s | HallWayLoop",
    description:
      "Discover, apply, and manage college society applications in one place.",
  },

  /** SEO keywords for the marketing pages. */
  keywords: [
    "campus societies",
    "college clubs",
    "student organizations",
    "club applications",
    "society management",
    "join a college club",
  ],

  /**
   * Default social share image (Open Graph / Twitter card), relative to
   * the site root or a full URL. For best results on social platforms,
   * point this at a real 1200x630 image rather than the logo.
   */
  ogImage: "/logo.svg",

  /** BCP-47 locale used in Open Graph tags. */
  locale: "en_US",

  /** Shown in the footer. */
  contactEmail: "info@hallwayloop.com",

  /** Shown in the footer. */
  author: "Aniruddh Sharma",

  /** Social links shown in the footer. */
  social: {
    github: "https://github.com/Sharmax12",
  },
} as const

/**
 * robots.txt rules — which paths search engines are allowed to crawl.
 * Authenticated/private app routes stay disallowed; public marketing and
 * discovery pages stay allowed.
 */
export const robotsConfig = {
  allow: ["/", "/societies"],
  disallow: ["/dashboard", "/admin", "/apply", "/auth", "/api"],
} as const

/**
 * Static (non-database-driven) routes included in sitemap.xml. The
 * per-society and per-event entries are generated dynamically in
 * app/(auth)/sitemap.ts from the database.
 */
export const staticSitemapRoutes: {
  path: string
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: number
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/societies", changeFrequency: "daily", priority: 0.9 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
]

/** Builds the JSON-LD WebSite entity used on the homepage. */
export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.marketing.tagline,
  }
}
