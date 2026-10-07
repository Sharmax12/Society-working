import type { Metadata } from "next";
import { buildFaqJsonLd, geoFaqs, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Learn what HallWayLoop is, who it is for, what you can do on the platform, and how it helps students discover campus communities and opportunities.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | HallWayLoop",
    description:
      "Answers about HallWayLoop, HWL, campus societies, student clubs, events, and community discovery.",
    url: "/faq",
    type: "website",
  },
};

export default function FAQPage() {
  const faqJsonLd = buildFaqJsonLd();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-600">
          HallWayLoop / HWL
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Clear answers about HallWayLoop, the campus communities it connects,
          and the opportunities users can discover.
        </p>
      </header>

      <section className="space-y-8" aria-label="HallWayLoop frequently asked questions">
        {geoFaqs.map((faq) => (
          <article key={faq.question} className="border-b pb-8">
            <h2 className="text-xl font-bold">{faq.question}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border p-6">
        <h2 className="text-xl font-bold">About HallWayLoop</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          HallWayLoop is built to make campus discovery more useful and
          actionable. The platform brings societies, clubs, events, student
          communities, and people into a shared environment so users can move
          from discovering something relevant to participating in it.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Official website: {siteConfig.url}
        </p>
      </section>
    </main>
  );
}
