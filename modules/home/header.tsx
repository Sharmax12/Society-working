import Link from "next/link";
import {ThemeToggle} from "@/components/ui/theme-toggle"
import logo from "@/public/logo.svg"
export function Header() {
  return (
    <header className="border-b border-neutral-900/10 bg-[#FBF9F5]/90 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold font-mono text-sm group-hover:bg-amber-600 transition-colors">
              <img src={logo.src} alt="HallWayLoop Logo" className="w-5 h-5" />
            </span>
            <span className="font-bold tracking-tight text-lg">
              HallWayLoop<span className="text-amber-600">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <Link href="/societies" className="hover:text-neutral-900 transition-colors">
              Societies
            </Link>
            <Link href="/events" className="hover:text-neutral-900 transition-colors">
              Events
            </Link>
            <Link href="/Connect" className="hover:text-neutral-900 transition-colors">
              Connect
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/societies"
              className="px-4 py-2 text-sm font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-md border border-neutral-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Explore Campus →
            </Link>
          </div>
        </div>
      </header>
  );
}
