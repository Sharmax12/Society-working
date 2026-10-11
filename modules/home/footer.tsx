import Link from "next/link";
import { LaunchSignupCTA } from "@/modules/connect/components/launch-signup-cta";
import { siteConfig } from "@/lib/seo";

const footerLinkClass =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/70 text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 border-b border-border py-9 sm:grid-cols-[1fr_auto] sm:items-center sm:py-10">
          <div>
            <Link href="/" aria-label="HallWayLoop home" className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">H</span>
              HallWayLoop<span className="text-primary">.</span>
            </Link>
            <h2 className="mt-4 max-w-md text-xl font-semibold leading-tight tracking-[-.03em] sm:text-2xl">
              Your campus life, a little more connected.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              The mobile app is in development around a campus feed, Discover, Events, and Messages. While it takes shape, explore society profiles and published events here.
            </p>
          </div>

          <div className="sm:min-w-[260px]">
            <p className="text-sm font-semibold">Get HallWayLoop updates</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Hear when new campus discovery features are ready.</p>
            <div className="mt-3">
              <LaunchSignupCTA />
            </div>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="grid gap-8 py-8 sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li><Link href="/societies" className={footerLinkClass}>Societies</Link></li>
              <li><Link href="/events" className={footerLinkClass}>Events</Link></li>
              <li><Link href="/connect-launch" className={footerLinkClass}>Updates</Link></li>
              <li><Link href="/faq" className={footerLinkClass}>FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">For campus teams</h2>
            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li><Link href="/for-societies" className={footerLinkClass}>For societies</Link></li>
              <li><Link href="/for-colleges" className={footerLinkClass}>For colleges</Link></li>
              <li><Link href="/about" className={footerLinkClass}>About</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal</h2>
            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li><Link href="/privacy" className={footerLinkClass}>Privacy</Link></li>
              <li><Link href="/terms" className={footerLinkClass}>Terms</Link></li>
              <li><a href={`mailto:${siteConfig.contactEmail}`} className={footerLinkClass}>Contact</a></li>
            </ul>
          </div>
        </nav>

        <div className="flex flex-col justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Made for campus, with <span aria-label="love" role="img" className="inline-block text-primary">♥</span>.</p>
          <p className="italic">Discover. Participate. Belong.</p>
        </div>
      </div>
    </footer>
  );
}
