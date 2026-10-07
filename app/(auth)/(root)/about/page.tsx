import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, buildOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About HallWayLoop",
  description:
    "Learn what HallWayLoop is, why it exists, who it is built for, and how the platform connects students with societies, clubs, events, and people.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About HallWayLoop",
    description:
      "HallWayLoop connects students with campus societies, clubs, events, communities, and people.",
    url: "/about",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (

    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <header className="mb-14">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-600">
          HallWayLoop / HWL
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          About HallWayLoop
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          HallWayLoop is a campus community platform built to make it easier
          for students to discover where they belong and participate in what
          is happening around them.
        </p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold">What is HallWayLoop?</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            HallWayLoop, also known as HWL, brings college societies, student
            clubs, campus events, student communities, and people together in
            one place. The goal is simple: make discovery easier and help
            students move from seeing an opportunity to actually participating
            in it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">What can students discover?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Societies & clubs", "Explore student-led communities and find groups aligned with your interests."],
              ["Campus events", "Discover workshops, meetups, activities, and events happening through campus communities."],
              ["People to connect with", "Find students with shared interests, skills, projects, and hobbies."],
              ["Ways to participate", "Move beyond discovery by joining communities, applying to opportunities, and showing up."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border p-5">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Who is building HallWayLoop?</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            HallWayLoop was founded by{" "}
            <a
              href={siteConfig.founderUrl}
              className="font-semibold text-foreground underline underline-offset-4"
            >
              {siteConfig.author}
            </a>
            . The project is being developed around a practical idea: campus
            communities become more useful when students can easily discover
            them, understand what they offer, and find a way to participate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">The HallWayLoop ecosystem</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            HallWayLoop connects several related experiences: society
            discovery, event discovery, campus networking through Connect,
            messaging, and applications to opportunities. AI-powered
            conversational functionality is also being developed to make
            navigating these experiences more natural.
          </p>
        </section>

        <nav className="flex flex-wrap gap-3 border-t pt-8" aria-label="HallWayLoop resources">
          <Link className="rounded-lg border px-4 py-2 text-sm font-semibold" href="/societies">
            Explore Societies
          </Link>
          <Link className="rounded-lg border px-4 py-2 text-sm font-semibold" href="/events">
            Explore Events
          </Link>
          <Link className="rounded-lg border px-4 py-2 text-sm font-semibold" href="/faq">
            Read FAQs
          </Link>
        </nav>
      </div>
    </main>
  );
}
