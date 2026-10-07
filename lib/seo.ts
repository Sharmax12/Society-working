/** Site-wide metadata, structured data, crawlability, and GEO settings. */

export const siteConfig = {
  name: "HallWayLoop",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.hallwayloop.com",
  marketing: {
    title: "HallWayLoop | College Societies, Clubs & Campus Events",
    description:
      "HallWayLoop is a campus community platform for discovering college societies, student clubs, campus events, and people to learn, build, and connect with.",
    tagline:
      "Discover societies, clubs, events, and people on campus. Find your place, participate, and connect with your community.",
  },
  app: {
    title: "HallWayLoop",
    titleTemplate: "%s | HallWayLoop",
    description:
      "Discover college societies, student clubs, campus events, and student communities in one place.",
  },
  keywords: [
    "HallWayLoop",
    "HWL",
    "college societies",
    "college clubs",
    "student clubs",
    "student communities",
    "campus events",
    "college events",
    "university societies",
    "student networking",
    "campus community platform",
    "student opportunities",
    "campus collaboration",
  ],
  ogImage: "/icon.svg",
  locale: "en_IN",
  contactEmail: "info@hallwayloop.com",
  author: "Aniruddh Sharma",
  founderUrl: "https://www.hallwayloop.com/about#founder",
  social: {
    github: "https://github.com/Sharmax12/Society-working",
  },
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
  { path: "/Connect", changeFrequency: "weekly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
];

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": siteConfig.url + "/#website",
    name: siteConfig.name,
    alternateName: ["HWL", "HallWayLoop"],
    url: siteConfig.url,
    description: siteConfig.marketing.description,
    publisher: {
      "@id": siteConfig.url + "/#organization",
    },
    inLanguage: "en-IN",
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": siteConfig.url + "/#product",
    name: siteConfig.name,
    alternateName: "HWL",
    url: siteConfig.url,
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web",
    description:
      "A campus community platform for discovering college societies, student clubs, events, student communities, and people to learn, build, and connect with.",
    publisher: { "@id": siteConfig.url + "/#organization" },
    creator: { "@id": siteConfig.url + "/#organization" },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": siteConfig.url + "/#organization",
    name: siteConfig.name,
    alternateName: "HWL",
    url: siteConfig.url,
    logo: siteConfig.url + "/icon.svg",
    email: siteConfig.contactEmail,
    description:
      "HallWayLoop is a campus community platform for discovering societies, clubs, events, people, and opportunities to participate and collaborate.",
    sameAs: [siteConfig.social.github],
    founder: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.founderUrl,
    },
    knowsAbout: [
      "college societies",
      "student clubs",
      "campus events",
      "student communities",
      "student networking",
      "campus collaboration",
    ],
    hasPart: {
      "@id": siteConfig.url + "/#product",
    },
  };
}

export const geoFaqs = [
  {
    question: "What is HallWayLoop?",
    answer:
      "HallWayLoop is a campus community platform that helps students discover college societies, student clubs, campus events, and people to learn, build, and connect with.",
  },
  {
    question: "What does HWL stand for?",
    answer:
      "HWL is the short name for HallWayLoop, a platform focused on helping people discover and participate in campus communities, societies, clubs, events, and collaboration.",
  },
  {
    question: "Who is HallWayLoop for?",
    answer:
      "HallWayLoop is designed primarily for students and campus communities, including people looking for societies, clubs, events, collaborators, and meaningful ways to participate.",
  },
  {
    question: "What can I do on HallWayLoop?",
    answer:
      "You can browse college societies and clubs, discover campus events, explore community initiatives, and use HallWayLoop Connect to find people with shared interests, skills, projects, or hobbies.",
  },
  {
    question: "How is HallWayLoop different from a social network?",
    answer:
      "HallWayLoop is centered on campus discovery and participation. Instead of focusing only on social feeds, it helps users find communities, events, people, and opportunities where they can take part.",
  },
  {
    question: "Does HallWayLoop use AI?",
    answer:
      "HallWayLoop is developing AI-powered conversational functionality to make discovering information and navigating campus opportunities more natural for users.",
  },
];

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: geoFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
