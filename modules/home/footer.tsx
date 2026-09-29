import Link from "next/link";
import { ArrowUpRight, Compass, CalendarDays, Heart } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#d95743]/10 bg-[#fffaf6] pt-4 pb-8 text-[#302724] dark:border-[#ff806b]/10 dark:bg-[#1a1413] dark:text-[#fff4ed]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand & Headline Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d95743]/20 bg-[#d95743]/5 px-3 py-1 text-xs font-semibold text-[#b94131] dark:border-[#ff806b]/20 dark:bg-[#ff806b]/10 dark:text-[#ff9a88]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d95743] dark:bg-[#ff806b]" />
              {siteConfig.name}
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              The best campus stories{" "}
              <span className="text-[#d95743] dark:text-[#ff806b]">happen together.</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6f5a52] dark:text-[#c5b2aa]">
              Find your people, show up for something you love, and make this campus feel a little more like yours.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-8">
            
            {/* Column 1 */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">
                Find your thing
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium">
                <li>
                  <Link
                    href="/societies"
                    className="inline-flex items-center gap-2 text-[#493a34] transition-colors hover:text-[#d95743] dark:text-[#e7d8d1] dark:hover:text-[#ff806b]"
                  >
                    <Compass className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]" />
                    Societies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-[#493a34] transition-colors hover:text-[#d95743] dark:text-[#e7d8d1] dark:hover:text-[#ff806b]"
                  >
                    <CalendarDays className="h-4 w-4 text-[#d95743] dark:text-[#ff806b]" />
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">
                Say hello
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium">
                <li>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-[#493a34] transition-colors hover:text-[#d95743] dark:text-[#e7d8d1] dark:hover:text-[#ff806b]"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 text-[#493a34] transition-colors hover:text-[#d95743] dark:text-[#e7d8d1] dark:hover:text-[#ff806b]"
                  >
                    Admin <ArrowUpRight className="h-3 w-3 opacity-70" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a18a80] dark:text-[#9f8980]">
                Around the web
              </p>
              <div className="mt-4">
                <Link
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#493a34] transition-colors hover:text-[#d95743] dark:text-[#e7d8d1] dark:hover:text-[#ff806b]"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub <ArrowUpRight className="h-3 w-3 opacity-70" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#d95743]/10 pt-6 text-xs text-[#8c746a] dark:border-[#ff806b]/10 dark:text-[#a99389] sm:flex-row">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} {siteConfig.name}. Made for campus, with{" "}
            <Heart className="h-3 w-3 fill-[#d95743] text-[#d95743] dark:fill-[#ff806b] dark:text-[#ff806b]" />.
          </p>
          <p className="italic text-[#a18a80] dark:text-[#8f7970]">
            A little closer to your people.
          </p>
        </div>
      </div>
    </footer>
  );
}