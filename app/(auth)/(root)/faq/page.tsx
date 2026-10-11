import type { Metadata } from "next";
import { buildFaqJsonLd, geoFaqs, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "HallWayLoop FAQs",
  description:
    "Answers about the HallWayLoop college community app, its four main destinations, verification approach, roadmap, and what is available on the website today.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "HallWayLoop FAQs",
    description:
      "Learn about HWL's Home, Discover, Events, and Messages blueprint, plus the current website experience.",
    url: "/faq",
    type: "website",
  },
};

export default function FAQPage() {
  const faqJsonLd = buildFaqJsonLd();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-primary">
          HallWayLoop / HWL
        </p>
        <h1 className="text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
          The loop, explained.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Clear answers about the mobile app being built, the product roadmap,
          and what you can explore on the website right now.
        </p>
      </header>

      <section className="space-y-0" aria-label="HallWayLoop frequently asked questions">
        {geoFaqs.map((faq) => (
          <article key={faq.question} className="border-b border-border py-6 first:pt-0">
            <h2 className="text-lg font-semibold sm:text-xl">{faq.question}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Explore the website</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Browse society profiles and published campus events while the mobile
          app takes shape.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Official website: {siteConfig.url}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/societies" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-85">Societies</a>
          <a href="/events" className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">Events</a>
          <a href="/about" className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">About HWL</a>
        </div>
      </section>
    </main>
  );
}
