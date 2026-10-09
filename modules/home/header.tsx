import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/auth";
import { SignOutButton } from "@/modules/auth/components/sign-out";

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="HallWayLoop home" className="flex shrink-0 items-center gap-2.5">
          <Image src="/icon.svg" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
          <span className="text-[17px] font-semibold tracking-[-.04em]">HallWayLoop<span className="text-primary">.</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link href="/societies" className="transition hover:text-foreground">Societies</Link>
          <Link href="/events" className="transition hover:text-foreground">Events</Link>
          <Link href={isLoggedIn ? "/connect" : "/Connect"} className="transition hover:text-foreground">Connect</Link>
          {isLoggedIn && <Link href="/messages" className="transition hover:text-foreground">Messages</Link>}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isLoggedIn ? <SignOutButton /> : (
            <Link href="/auth/sign-in" className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">Sign in</Link>
          )}
          <Link href="/societies" className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85 sm:inline-flex">Explore campus <span className="ml-1.5">↗</span></Link>
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex gap-5 overflow-x-auto border-t border-border/70 px-5 py-3 text-sm text-muted-foreground md:hidden">
        <Link href="/societies" className="whitespace-nowrap hover:text-foreground">Societies</Link>
        <Link href="/events" className="whitespace-nowrap hover:text-foreground">Events</Link>
        <Link href={isLoggedIn ? "/connect" : "/Connect"} className="whitespace-nowrap hover:text-foreground">Connect</Link>
        {isLoggedIn && <Link href="/messages" className="whitespace-nowrap hover:text-foreground">Messages</Link>}
      </nav>
    </header>
  );
}
