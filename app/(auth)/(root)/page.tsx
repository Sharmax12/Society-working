import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Compass, MessageCircle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import CampusScene from "@/components/campus-scene";
import { jsonLdString } from "@/lib/utils";
import { buildWebsiteJsonLd } from "@/lib/seo";

const jsonLd = buildWebsiteJsonLd();

const features = [
  { icon: Compass, number: "01", title: "Discover", text: "Find societies, communities and interests that feel like your corner of campus." },
  { icon: CalendarDays, number: "02", title: "Show up", text: "See workshops, fests, competitions and meetups before you miss them." },
  { icon: MessageCircle, number: "03", title: "Connect", text: "Turn shared interests into real conversations and campus friendships." },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <section className="relative min-h-[calc(100vh-92px)] overflow-hidden border-b border-foreground/10 surface-grid">
        <CampusScene />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,var(--background)_74%)]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
          <div className="max-w-5xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/75 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-muted-foreground shadow-lg backdrop-blur-xl">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary"><Sparkles className="h-3 w-3" /></span>
              The campus social network
            </div>
            <h1 className="text-balance text-5xl font-black leading-[.92] tracking-[-.065em] sm:text-7xl lg:text-[7.5rem]">
              Campus life,
              <br />
              <span className="bg-gradient-to-r from-primary via-[#e96c4d] to-[#f0a36b] bg-clip-text text-transparent">finally connected.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              HallWayLoop brings societies, events and students into one living campus network. Discover your people, find your next thing, and make college feel smaller.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/societies"><Button size="lg" variant="brand" className="h-13 rounded-2xl px-7 shadow-[0_15px_45px_-18px] shadow-primary">Explore societies <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link href="/events"><Button size="lg" variant="outline" className="h-13 rounded-2xl border-foreground/15 bg-background/65 px-7 backdrop-blur hover:bg-background">Browse events</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.4fr]">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">01 / Why HallWayLoop ? </p><h2 className="mt-4 max-w-md text-4xl font-black tracking-[-.05em] sm:text-5xl">Your campus has a pulse. We make it visible.</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map(({ icon: Icon, number, title, text }) => <div key={title} className="group rounded-3xl border border-foreground/10 bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="flex items-center justify-between"><span className="text-xs font-black text-muted-foreground">{number}</span><Icon className="h-5 w-5 text-primary" /></div><h3 className="mt-12 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="group relative isolate overflow-hidden rounded-[2rem] border border-[#b94131]/20 bg-[#fbe8e2] text-[#302724] shadow-[0_24px_80px_-40px_rgba(185,65,49,.45)] transition-shadow duration-500 hover:shadow-[0_30px_90px_-38px_rgba(185,65,49,.55)] dark:border-[#ff806b]/25 dark:bg-[#291d1b] dark:text-[#fff4ed]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-[#d95743]/20 blur-3xl dark:bg-[#ff806b]/15" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-[38%] -z-10 h-72 w-72 rounded-full bg-[#e9a17f]/25 blur-3xl dark:bg-[#8f3c31]/25" />
          <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-16 lg:p-14">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d95743]/25 bg-white/45 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a83e2e] dark:border-[#ff806b]/25 dark:bg-black/15 dark:text-[#ff9a88]"><Zap className="h-3.5 w-3.5" /> A little more campus, a lot less scrolling</div>
              <h2 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-.055em] sm:text-6xl">Stop scrolling past campus<span className="text-[#d95743] dark:text-[#ff806b]">.</span></h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#765b52] dark:text-[#cdb7ae]">The club you didn&apos;t know existed. The event your friends will talk about. Your next favourite corner of campus is closer than you think.</p>
              <p className="mt-5 text-xs font-semibold tracking-wide text-[#a17d70] dark:text-[#aa8c81]">Discover · Belong · Connect</p>
            </div>
            <Link href="/societies" className="shrink-0"><Button size="lg" className="h-13 rounded-2xl bg-[#d95743] px-7 text-white shadow-lg shadow-[#b94131]/20 transition hover:-translate-y-0.5 hover:bg-[#b94131] dark:bg-[#ff806b] dark:text-[#271714] dark:hover:bg-[#ff9a88]">Find your people <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <div className="flex items-center justify-between border-t border-[#b94131]/15 px-7 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#a17d70] dark:border-[#ff806b]/15 dark:text-[#aa8c81]"><span>Made for the in-between moments</span><span className="hidden sm:inline">Your campus, in full colour ↗</span></div>
        </div>
      </section>
    </main>
  );
}
