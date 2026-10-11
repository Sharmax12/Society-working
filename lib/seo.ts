/** Site-wide metadata, structured data, crawlability, and GEO settings. */

export const siteConfig = {
  name: "HallWayLoop",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.hallwayloop.com",
  marketing: {
    title: "HallWayLoop | Your College Community, in One Loop",
    description:
      "HallWayLoop is a college-centred social app in development for campus announcements, student communities, events, profiles, and messaging. Explore societies and published events on the website today.",
    tagline:
      "Discover people, societies, events, and conversations around your campus. Find your place and take part.",
  },
  app: {
    title: "HallWayLoop",
    titleTemplate: "%s | HallWayLoop",
    description:
      "A college-centred social, events, and messaging app in development for student communities.",
  },
  keywords: [
    "HallWayLoop",
    "HWL",
    "college community app",
    "college social app",
    "college societies",
    "college clubs",
    "student clubs",
    "student profiles",
    "campus announcements",
    "student communities",
    "campus events",
    "college events",
    "student messaging",
    "student networking",
    "student opportunities",
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
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
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
    operatingSystem: "Android, iOS",
    description:
      "HallWayLoop is developing a college-centred social app organised around Home, Discover, Events, and Messages. The website currently provides society and event discovery.",
    featureList: [
      "Campus feed and short announcements",
      "Student and society profiles",
      "People and society discovery",
      "College event listings and filters",
      "Direct and group messaging in the product blueprint",
      "College-linked verification and community safety controls in the product blueprint",
    ],
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
      "HallWayLoop is building a college-centred social app for campus announcements, student and society profiles, event discovery, messaging, and participation in college communities.",
    sameAs: [siteConfig.social.github],
    founder: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.founderUrl,
    },
    knowsAbout: [
      "college communities",
      "college societies",
      "student clubs",
      "campus announcements",
      "campus events",
      "student profiles",
      "student messaging",
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
      "HallWayLoop, also called HWL, is a college-centred social, events, and messaging app in development. Its aim is to bring campus announcements, student and society profiles, events, and conversations into one place. The website currently lets students explore societies and published campus events.",
  },
  {
    question: "What does HWL stand for?",
    answer:
      "HWL is the short name for HallWayLoop, a product being built to help students discover what is happening on campus, find communities, and connect with other students.",
  },
  {
    question: "Who is HallWayLoop for?",
    answer:
      "HallWayLoop is designed primarily for college students and campus communities, including society admins and, where approved, college staff sharing official announcements.",
  },
  {
    question: "What are the main areas of the HallWayLoop app?",
    answer:
      "The mobile app blueprint has four main destinations: Home for the feed and announcements, Search or Discover for people, societies, and events, Events for filtered event listings, and Messages for direct and group conversations. A user's profile is reachable from the top-right of Home.",
  },
  {
    question: "Is the HallWayLoop mobile app available to download?",
    answer:
      "The mobile app is in development and no app-store download is announced on this website. For now, visitors can explore the website's society directory and published campus event listings.",
  },
  {
    question: "Will students need a college ID?",
    answer:
      "The product blueprint proposes verifying college affiliation with a college email or college ID. Joining societies and full participation are intended to be tied to verified college membership; the exact verification process will be confirmed during the pilot.",
  },
  {
    question: "How does HallWayLoop plan to support safety and privacy?",
    answer:
      "The product blueprint calls for report, block, and mute controls; message requests from non-followers; college-scoped visibility by default; and a moderation review queue. Privacy settings, data minimisation, and the final launch policies still need to be implemented and reviewed.",
  },
  {
    question: "Can students discover events from nearby colleges?",
    answer:
      "In the app blueprint, events are visible within the host's college by default. Hosts may mark suitable events as public so students can discover them through nearby-college filters.",
  },
  {
    question: "Which features are planned for later releases?",
    answer:
      "The blueprint places the stories and updates strip, notification bell, event RSVP, reminders, calendar sync, and expanded society administration tools in later releases. Availability may change as the pilot and product roadmap are validated.",
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
