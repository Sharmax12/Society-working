import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Compass, MessageCircle, Sparkles, Users, Zap } from "lucide-react";
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
              <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">finally connected.</span>
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
        <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-foreground p-8 text-background sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] opacity-60"><Zap className="h-4 w-4" /> Built for student life</div><h2 className="max-w-2xl text-4xl font-black tracking-[-.05em] sm:text-6xl">Stop scrolling past campus.</h2><p className="mt-5 max-w-xl text-sm leading-6 opacity-65">There&apos;s always something happening. Make the next thing you attend the beginning of something bigger.</p></div>
            <Link href="/societies"><Button size="lg" className="h-13 rounded-2xl bg-background px-7 text-foreground hover:bg-background/90">Start exploring <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
