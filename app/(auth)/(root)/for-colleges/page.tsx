import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, CalendarCheck, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/seo";

const description =
  "Learn how HallWayLoop plans to support colleges with clearer event discovery, student communities, and campus communication.";

export const metadata: Metadata = {
  title: "For Colleges",
  description,
  alternates: { canonical: "/for-colleges" },
  openGraph: {
    title: "For Colleges | HallWayLoop",
    description,
    url: "/for-colleges",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop for colleges" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Colleges | HallWayLoop",
    description,
    images: [siteConfig.ogImage],
  },
};

const ideas = [
  {
    icon: CalendarCheck,
    title: "Make campus activity easier to discover",
    text: "Bring published events and student-led activities into a clearer discovery experience.",
  },
  {
    icon: Building2,
    title: "Keep college context visible",
    text: "Organise society and event information around the campus community it belongs to.",
  },
  {
    icon: ShieldCheck,
    title: "Build trust deliberately",
    text: "Work with the HallWayLoop team on affiliation checks, moderation expectations, and launch requirements before a campus rollout.",
  },
];

export default function ForCollegesPage() {
  const subject = encodeURIComponent("Explore a HallWayLoop campus partnership");

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">For colleges and campus teams</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-6xl">
          Help students find more of campus life.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          HallWayLoop is being developed to connect student communities, society profiles, announcements, and event discovery. We’re interested in speaking with colleges that want to shape a practical pilot.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={`mailto:${siteConfig.contactEmail}?subject=${subject}`} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85">
            Discuss a campus pilot <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted">
            About HallWayLoop
          </Link>
        </div>
      </header>

      <section className="mt-14 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
        {ideas.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>
      <p className="mt-5 text-xs leading-5 text-muted-foreground">HallWayLoop is in development. A listing or partnership does not imply that a college has formally endorsed the product.</p>
    </main>
  );
}
