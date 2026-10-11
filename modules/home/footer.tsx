import Link from "next/link";
import { CalendarDays, Compass, MessageCircle, Mail } from "lucide-react";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#d95743]/10 bg-[#fffaf6] pt-10 pb-8 text-[#302724] dark:border-[#ff806b]/10 dark:bg-[#1a1413] dark:text-[#fff4ed]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d95743] text-sm text-white">H</span>
              HallWayLoop<span className="text-[#d95743]">.</span>
            </Link>
            <h2 className="mt-5 max-w-md text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-3xl">
              Your campus life, a little more connected.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#6f5a52] dark:text-[#c5b2aa]">
              The mobile app is in development around a campus feed, Discover, Events, and Messages.
              While it takes shape, explore society profiles and published events on the website.
            </p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#d95743] dark:hover:text-[#ff806b]">
              <Mail className="h-4 w-4" /> Contact HallWayLoop
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">Explore</p>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                <li><Link href="/societies" className="inline-flex items-center gap-2 transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]"><Compass className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]" /> Societies</Link></li>
                <li><Link href="/events" className="inline-flex items-center gap-2 transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]"><CalendarDays className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]" /> Events</Link></li>
                <li><Link href="/connect-launch" className="inline-flex items-center gap-2 transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]"><MessageCircle className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]" /> Connect updates</Link></li>
                <li><Link href="/faq" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">For campus teams</p>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                <li><Link href="/for-societies" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">For societies</Link></li>
                <li><Link href="/for-colleges" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">For colleges</Link></li>
                <li><Link href="/about" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">About HWL</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">Policies</p>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                <li><Link href="/privacy" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">Privacy</Link></li>
                <li><Link href="/terms" className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">Terms</Link></li>
                <li><a href={`mailto:${siteConfig.contactEmail}`} className="transition-colors hover:text-[#d95743] dark:hover:text-[#ff806b]">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#d95743]/10 pt-6 text-xs text-[#8c746a] dark:border-[#ff806b]/10 dark:text-[#a99389] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Made for campus, with <span aria-label="love" role="img" className="inline-block text-[#d95743] dark:text-[#ff806b]">♥</span>.</p>
          <p className="italic text-[#a18a80] dark:text-[#8f7970]">Discover. Participate. Belong.</p>
        </div>
      </div>
    </footer>
  );
}
