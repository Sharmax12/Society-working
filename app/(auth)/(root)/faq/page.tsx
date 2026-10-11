import type { Metadata } from "next";
import Link from "next/link";
import { buildFaqJsonLd, geoFaqs, siteConfig } from "@/lib/seo";

const faqDescription =
  "Answers about the HallWayLoop college community app, its main destinations, planned college-affiliation checks, roadmap, and what is available on the website today.";

export const metadata: Metadata = {
  title: "FAQs",
  description: faqDescription,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "HallWayLoop FAQs",
    description: "Learn about HWL's Home, Discover, Events, and Messages blueprint, plus the current website experience.",
    url: "/faq",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop FAQs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HallWayLoop FAQs",
    description: faqDescription,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function FAQPage() {
  const faqJsonLd = buildFaqJsonLd();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />

      <header className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-primary">HallWayLoop / HWL</p>
        <h1 className="text-4xl font-semibold tracking-[-.05em] sm:text-6xl">The loop, explained.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Clear answers about the mobile app being built, the product roadmap, and what you can explore on the website right now.
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
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Browse society profiles and published campus events while the mobile app takes shape.</p>
        <p className="mt-3 text-xs text-muted-foreground">Official website: {siteConfig.url}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/societies" className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-85">Societies</Link>
          <Link href="/events" className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">Events</Link>
          <Link href="/about" className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">About HWL</Link>
          <Link href="/for-societies" className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">For societies</Link>
        </div>
      </section>
    </main>
  );
}
