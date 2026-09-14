import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Compass, ShieldCheck } from "lucide-react";
import UserButton from "../auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/societies", label: "Discover", icon: Compass },
  { href: "/events", label: "Events", icon: CalendarDays },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav aria-label="Primary navigation" className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-[1.35rem] border border-foreground/10 bg-background/75 px-3 shadow-[0_22px_70px_-35px_rgba(0,0,0,.55)] backdrop-blur-2xl sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="HallWayLoop home">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-foreground shadow-lg transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <Image src="/logo.svg" alt="HallWayLoop" height={30} width={30} className="invert dark:invert-0" />
            </span>
            <span className="hidden text-[15px] font-black tracking-[-.04em] sm:block">HallWayLoop<span className="text-primary">.</span></span>
          </Link>
          <div className="hidden items-center gap-1 rounded-xl bg-muted/70 p-1 sm:flex">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="group flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"><Icon className="h-3.5 w-3.5 transition group-hover:scale-110"/> {label}</Link>)}
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-label={label} title={label} className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Icon className="h-4 w-4" /></Link>)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/admin" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-foreground/10 hover:bg-muted hover:text-foreground md:flex"><ShieldCheck className="h-3.5 w-3.5"/> DashBoard <ArrowUpRight className="h-3 w-3"/></Link>
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
