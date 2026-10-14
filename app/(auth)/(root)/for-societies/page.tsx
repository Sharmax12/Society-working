import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Megaphone, Users } from "lucide-react";
import { siteConfig } from "@/lib/seo";
import { CampusLeadForm } from "@/modules/connect/components/campus-lead-form";

const description =
  "Bring your college society to HallWayLoop. Share your profile, publish events, and help students find ways to take part.";

export const metadata: Metadata = {
  title: "For Societies",
  description,
  alternates: { canonical: "/for-societies" },
  openGraph: {
    title: "For Societies | HallWayLoop",
    description,
    url: "/for-societies",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop for college societies" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Societies | HallWayLoop",
    description,
    images: [siteConfig.ogImage],
  },
};

const benefits = [
  {
    icon: Users,
    title: "Make your society easier to find",
    text: "Give students one place to learn what your society does and how to get involved.",
  },
  {
    icon: CalendarDays,
    title: "Share events with context",
    text: "Help students discover workshops, competitions, meetups, and campus activities as event listings become available.",
  },
  {
    icon: Megaphone,
    title: "Make the next step clear",
    text: "Point interested students towards your application process, organiser contact, or event registration.",
  },
];

export default function ForSocietiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">For campus organisers</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-6xl">
          Your society deserves to be found.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          HallWayLoop is building a simpler way for students to discover college societies and campus events. We want to work with student organisers as we shape the pilot.
        </p>
        <div className="mt-8 max-w-xl">
          <CampusLeadForm
            kind="society"
            title="Tell us about your society"
            description="Share your name, society, and email. The HallWayLoop team will follow up about a listing or pilot."
          />
        </div>
        <Link href="/events" className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted">
          Explore events <CalendarDays className="h-4 w-4" />
        </Link>
      </header>

      <section className="mt-14 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
