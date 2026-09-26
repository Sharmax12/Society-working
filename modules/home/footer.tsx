import Link from "next/link";
import { ArrowUpRight, Compass, CalendarDays, Heart } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="px-3 pb-3 pt-8 sm:px-5 sm:pt-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#d95743]/20 bg-[#fff8f2] text-[#302724] shadow-[0_20px_70px_-38px_rgba(93,45,31,.35)] dark:border-[#ff806b]/20 dark:bg-[#201a19] dark:text-[#fff4ed]">
        <div className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-[#d95743]/15 blur-3xl dark:bg-[#ff806b]/15" />
          <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d95743]/20 bg-[#d95743]/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-[#b94131] dark:border-[#ff806b]/25 dark:bg-[#ff806b]/10 dark:text-[#ff9a88]">
                <span className="h-2 w-2 rounded-full bg-[#d95743] dark:bg-[#ff806b]" /> {siteConfig.name}
              </div>
              <h2 className="mt-6 max-w-xl text-3xl font-black leading-[1.05] tracking-[-.045em] sm:text-5xl">The best campus stories<br className="hidden sm:block" /> happen <span className="text-[#d95743] dark:text-[#ff806b]">together.</span></h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#6f5a52] dark:text-[#c5b2aa]">Find your people, show up for something you love, and make this campus feel a little more like yours.</p>
              <p className="mt-7 text-xs font-semibold tracking-wide text-[#8c746a] dark:text-[#a99389]">Discover · Belong · Connect</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a18a80] dark:text-[#9f8980]">Find your thing</p><div className="mt-4 space-y-3.5"><Link href="/societies" className="group flex items-center gap-2 text-sm font-medium text-[#493a34] transition-colors hover:text-[#b94131] dark:text-[#e7d8d1] dark:hover:text-[#ff9a88]"><Compass className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]"/> Societies</Link><Link href="/events" className="group flex items-center gap-2 text-sm font-medium text-[#493a34] transition-colors hover:text-[#b94131] dark:text-[#e7d8d1] dark:hover:text-[#ff9a88]"><CalendarDays className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]"/> Events</Link></div></div>
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a18a80] dark:text-[#9f8980]">Say hello</p><div className="mt-4 space-y-3.5"><a href={`mailto:${siteConfig.contactEmail}`} className="block text-sm font-medium text-[#493a34] transition-colors hover:text-[#b94131] dark:text-[#e7d8d1] dark:hover:text-[#ff9a88]">Contact</a><Link href="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-[#493a34] transition-colors hover:text-[#b94131] dark:text-[#e7d8d1] dark:hover:text-[#ff9a88]">Admin <ArrowUpRight className="h-3 w-3"/></Link></div></div>
              <div className="col-span-2 sm:col-span-1"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a18a80] dark:text-[#9f8980]">Around the web</p><Link href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#493a34] transition-colors hover:text-[#b94131] dark:text-[#e7d8d1] dark:hover:text-[#ff9a88]"><FaGithub className="h-4 w-4"/> GitHub <ArrowUpRight className="h-3 w-3"/></Link></div>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#d95743]/15 px-7 py-5 text-[11px] text-[#927b71] dark:border-[#ff806b]/15 dark:text-[#a99389] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14"><span>© {new Date().getFullYear()} {siteConfig.name}. Made for campus, with <Heart className="mx-0.5 inline h-3 w-3 fill-[#d95743] text-[#d95743] dark:fill-[#ff806b] dark:text-[#ff806b]" />.</span><span>A little closer to your people.</span></div>
        </div>
      </div>
    </footer>
  );
}
