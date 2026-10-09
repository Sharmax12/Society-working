import Link from "next/link";
import { buildOrganizationJsonLd, buildSoftwareApplicationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";

export default function Home() {
  const websiteJsonLd = buildWebsiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();
  const productJsonLd = buildSoftwareApplicationJsonLd();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-24">
        <section className="grid gap-12 border-b border-border pb-16 md:grid-cols-[1.2fr_.8fr] md:items-end md:pb-24">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Your campus, in one place
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-7xl">
              Find your people.
              <span className="mt-2 block text-muted-foreground">Find your place.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover student societies, find events worth showing up for, and meet people who share your interests.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/societies" className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85">
                Explore societies <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
              <Link href="/events" className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted">
                Browse events
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">A better campus starts here</p>
            <div className="mt-8 space-y-0">
              <Link href="/societies" className="group flex items-center justify-between border-b border-border py-5">
                <div><p className="font-semibold">Find a community</p><p className="mt-1 text-sm text-muted-foreground">Explore clubs and societies</p></div>
                <span className="text-xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">→</span>
              </Link>
              <Link href="/events" className="group flex items-center justify-between border-b border-border py-5">
                <div><p className="font-semibold">See what’s happening</p><p className="mt-1 text-sm text-muted-foreground">Workshops, meetups and more</p></div>
                <span className="text-xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">→</span>
              </Link>
              <Link href="/Connect" className="group flex items-center justify-between py-5">
                <div><p className="font-semibold">Connect with students</p><p className="mt-1 text-sm text-muted-foreground">Build, learn and explore together</p></div>
                <span className="text-xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-12 sm:grid-cols-3 sm:py-16">
          <div><p className="text-sm font-semibold">01 / Discover</p><h2 className="mt-3 text-xl font-semibold tracking-tight">Explore beyond your circle</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Find communities that match your interests, goals and curiosity.</p></div>
          <div><p className="text-sm font-semibold">02 / Participate</p><h2 className="mt-3 text-xl font-semibold tracking-tight">Take the first step</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Keep track of application windows and opportunities to get involved.</p></div>
          <div><p className="text-sm font-semibold">03 / Belong</p><h2 className="mt-3 text-xl font-semibold tracking-tight">Make campus yours</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Meet collaborators, attend events and build your own campus story.</p></div>
        </section>
      </main>
    </div>
  );
}
