import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, MessageCircle, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { CampusScene } from "@/components/campus-scene";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app";
const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "HallWayLoop", url: SITE_URL, description: "The campus platform for discovering societies, events, people and conversations." };

export default function Home() {
  return <main className="relative overflow-hidden bg-[#08080b] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="relative min-h-[calc(100vh-80px)] flex items-center">
      <CampusScene />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,#08080b_72%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 text-center">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-xl"><Sparkles className="h-3.5 w-3.5 text-rose-400" /> Built for campus life</div>
        <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-[-0.04em] sm:text-7xl lg:text-8xl">Find your people.<br /><span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-300 bg-clip-text text-transparent">Build your campus.</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">HallWayLoop brings college societies, events and students into one living campus network — discover what matters, join communities, and stay connected.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/societies"><Button size="lg" variant="brand" className="h-12 rounded-full px-7">Explore societies <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          <Link href="/events"><Button size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10">See what's happening</Button></Link>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {[{icon:Compass,title:"Discover",text:"Find societies that match your interests."},{icon:Users,title:"Belong",text:"Meet students who share your curiosity."},{icon:MessageCircle,title:"Connect",text:"A social layer designed for campus conversations."}].map((item)=><div key={item.title} className="rounded-2xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-xl"><item.icon className="mb-4 h-5 w-5 text-rose-400"/><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-white/45">{item.text}</p></div>)}
        </div>
      </div>
    </section>
  </main>;
}
