import Link from "next/link";
import { ArrowUpRight, Compass, CalendarDays } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-5">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-foreground/10 bg-foreground text-background">
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr] lg:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] opacity-55">
              <span className="h-2 w-2 rounded-full bg-primary" /> HallWayLoop
            </div>
            <h2 className="mt-5 max-w-xl text-4xl font-black tracking-[-.05em] sm:text-5xl">Your next campus memory starts here.</h2>
            <p className="mt-5 max-w-lg text-sm leading-6 opacity-60">Discover societies, find events, and turn the people around you into your community.</p>
          </div>
          <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pt-2">
            <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Explore</p><div className="mt-4 space-y-3"><Link href="/societies" className="flex items-center gap-2 text-sm opacity-75 transition hover:opacity-100"><Compass className="h-4 w-4"/> Societies</Link><Link href="/events" className="flex items-center gap-2 text-sm opacity-75 transition hover:opacity-100"><CalendarDays className="h-4 w-4"/> Events</Link></div></div>
            <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Connect</p><div className="mt-4 space-y-3"><a href={`mailto:${siteConfig.contactEmail}`} className="text-sm opacity-75 transition hover:opacity-100">Contact</a><Link href="/admin" className="flex items-center gap-1 text-sm opacity-75 transition hover:opacity-100">Admin <ArrowUpRight className="h-3 w-3"/></Link></div></div>
            <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Social</p><Link href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm opacity-75 transition hover:opacity-100"><FaGithub className="h-4 w-4"/> GitHub</Link></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-background/10 px-8 py-5 text-[11px] opacity-45 sm:flex-row sm:items-center sm:justify-between sm:px-12"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span></span></div>
      </div>
    </footer>
  );
}
