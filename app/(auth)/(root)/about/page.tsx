import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Compass, Home as HomeIcon, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { siteConfig, buildOrganizationJsonLd } from "@/lib/seo";

const aboutDescription =
  "Learn about HallWayLoop, the college-centred social app being built around campus announcements, people, societies, events, and messaging.";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About HallWayLoop",
    description: "HallWayLoop is being built to bring college communities, campus events, and student conversations closer together.",
    url: "/about",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "About HallWayLoop" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About HallWayLoop",
    description: aboutDescription,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

const appAreas = [
  { title: "Home", description: "A personalised campus feed with short announcements, posts, and student achievements.", icon: HomeIcon },
  { title: "Discover", description: "Search across people, societies, and events, with filters to help students find their next community.", icon: Compass },
  { title: "Events", description: "Browse events by date, category, campus, and nearby-college visibility.", icon: CalendarDays },
  { title: "Messages", description: "Direct and group conversations, including message requests for new connections.", icon: MessageCircle },
];

export default function AboutPage() {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />

      <header className="max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-primary">HallWayLoop / HWL</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-6xl">College life happens between the timetable slots.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          HallWayLoop is a college-centred social, events, and messaging app in development. It is being shaped to help students find what is happening, discover people and societies, and take part in campus life without switching between disconnected channels.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/societies" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85">Explore societies <ArrowUpRight className="h-4 w-4" /></Link>
          <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted">Browse events <CalendarDays className="h-4 w-4" /></Link>
        </div>
      </header>

      <section className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">The problem we are working on</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Campus information should not be scattered everywhere.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Students often hear about opportunities across group chats, society pages, noticeboards, and email. That makes it easy to miss an event or a community worth joining. HWL aims to bring the everyday campus loop — updates, discovery, events, and conversations — into one connected experience.
          </p>
        </div>
      </section>

      <section id="app" className="mt-14 sm:mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">The mobile app blueprint</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Four places to find your loop.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">The app is planned for Android and iOS. Its functionality will be built and validated in stages, starting with a pilot college.</p>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {appAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{area.description}</p>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">This describes the product report, not a guarantee that each mobile feature is already available.</p>
      </section>

      <section id="trust" className="mt-16 grid gap-8 border-t border-border pt-12 sm:mt-20 sm:pt-16 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Trust and safety</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">A campus network needs clear boundaries.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            The product blueprint includes college affiliation checks, controls over who can message or follow, reporting and blocking, and a moderation review flow. These are product requirements to implement and verify before the mobile launch, not a statement that every control is available today.
          </p>
        </div>
        <div className="space-y-3">
          <article className="flex gap-4 rounded-2xl border border-border p-5">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div><h3 className="font-semibold">Connected to a real college</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">The proposed sign-up flow checks college affiliation through a college email or ID. The final process will be confirmed during the pilot.</p></div>
          </article>
          <article className="flex gap-4 rounded-2xl border border-border p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div><h3 className="font-semibold">Visibility and moderation matter</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">The plan keeps profiles and posts within a student's college by default and includes report, block, and mute controls.</p></div>
          </article>
          <article className="flex gap-4 rounded-2xl border border-border p-5">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div><h3 className="font-semibold">Nearby events by choice</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Event hosts would choose which events are public to students at nearby colleges.</p></div>
          </article>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-border bg-card p-6 sm:mt-20 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Available on the website</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Start with what is live today.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          The website currently offers a society directory, published campus event listings, and sign-in flows for society applications. The wider mobile social experience described above is being developed separately.
        </p>
        <nav className="mt-6 flex flex-wrap gap-3" aria-label="HallWayLoop resources">
          <Link className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" href="/societies">Explore societies</Link>
          <Link className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" href="/events">Explore events</Link>
          <Link className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" href="/faq">Read FAQs</Link>
          <Link className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" href="/for-societies">For societies</Link>
          <Link className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" href="/for-colleges">For colleges</Link>
          <Link className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-85" href="/auth/sign-in">Sign in</Link>
        </nav>
      </section>

      <section id="founder" className="mt-14 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Who is building HallWayLoop?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          HallWayLoop was founded by{" "}
          <a href={siteConfig.founderUrl} className="font-semibold text-foreground underline underline-offset-4">{siteConfig.author}</a>
          . The product is being shaped around a practical idea: campus communities become more useful when students can find them, understand what is happening, and have a clear way to take part.
        </p>
      </section>
    </main>
  );
}
