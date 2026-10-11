import Link from "next/link";
import { LaunchSignupCTA } from "@/modules/connect/components/launch-signup-cta";
import { PhonePreview } from "./phone-preview";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Compass,
  Home as HomeIcon,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";

export default function Home() {
  const websiteJsonLd = buildWebsiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();
  const productJsonLd = buildSoftwareApplicationJsonLd();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-2 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            The college community app in development
          </p>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-6xl lg:text-7xl">
            Your campus has a life
            <span className="mt-2 block text-muted-foreground">beyond lectures.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            HallWayLoop is being built to bring campus updates, student
            communities, events, and conversations into one place — so good
            things are easier to find, and easier to join.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/societies"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:opacity-85"
            >
              Explore societies <ArrowRight className="h-4 w-4" />
            </Link>
            <LaunchSignupCTA />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Mobile app in development
            </span>
            <span>Designed around real campus communities</span>
          </div>
        </div>

        <PhonePreview />
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
            Trust and safety
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
            A community should feel like a community.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            The product report puts trust, clear boundaries, and college context
            at the centre of the experience. These are requirements for the
            app to build towards, not a claim that every control is live today.
          </p>
          <Link
            href="/about#trust"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            Read the approach <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-border p-5">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-semibold">College-linked access</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The blueprint calls for college email or ID verification before full participation.
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-semibold">Tools to feel safer</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reporting, blocking, message requests, and a moderation review flow are in the plan.
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5 sm:col-span-2">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-semibold">Local by default</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The proposed default keeps profiles and posts within a student's own college.
              Cross-college discovery is intended for events marked public by their hosts.
            </p>
          </article>
        </div>
      </section>

      <section id="app-blueprint" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
              The app blueprint
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
              Four everyday destinations.
              <span className="block text-muted-foreground">One closer campus.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              The mobile experience is being designed around the way students
              actually move through college life: catch up, discover, show up,
              and keep in touch.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-border bg-background p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <HomeIcon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">01 / Home</p>
              <h3 className="mt-2 text-lg font-semibold">Catch the loop</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A campus feed for short announcements, student posts, and achievements.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Compass className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">02 / Discover</p>
              <h3 className="mt-2 text-lg font-semibold">Find your people</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Explore student profiles, societies, and communities that match your interests.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">03 / Events</p>
              <h3 className="mt-2 text-lg font-semibold">Know what is on</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Find campus activities with filters for date, category, and nearby colleges.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">04 / Messages</p>
              <h3 className="mt-2 text-lg font-semibold">Keep in touch</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Direct and group conversations, with message requests for new connections.
              </p>
            </article>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            These describe the mobile product blueprint. App capabilities will roll out in stages.
          </p>
        </div>
      </section>


      <section className="border-y border-border bg-muted/35">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
                Start here, today
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                Explore what is already on the website.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                While the mobile app takes shape, you can browse society profiles,
                check published campus events, and sign in to manage your applications.
              </p>
            </div>
            <Link
              href="/auth/sign-in"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85"
            >
              Sign in to HWL <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link href="/societies" className="group flex items-center justify-between rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40">
              <div>
                <Compass className="h-5 w-5 text-primary" />
                <p className="mt-4 font-semibold">Discover societies</p>
                <p className="mt-1 text-sm text-muted-foreground">Find a community to join.</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/events" className="group flex items-center justify-between rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40">
              <div>
                <CalendarDays className="h-5 w-5 text-primary" />
                <p className="mt-4 font-semibold">Browse campus events</p>
                <p className="mt-1 text-sm text-muted-foreground">See what has been published.</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/about" className="group flex items-center justify-between rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40">
              <div>
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-4 font-semibold">Meet the idea</p>
                <p className="mt-1 text-sm text-muted-foreground">Read how the app is being shaped.</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-5 rounded-3xl bg-foreground px-6 py-8 text-background sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-background/60">
              HallWayLoop · HWL
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Campus life is better when you are in the loop.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-background/70">
              Start with a society, find an event, and help make your campus easier to connect.
            </p>
          </div>
          <Link
            href="/societies"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-85"
          >
            Find your next community <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
