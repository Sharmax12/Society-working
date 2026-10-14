import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/auth";
import { SignOutButton } from "@/modules/auth/components/sign-out";

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href={isLoggedIn ? "/dashboard" : "/"} aria-label="HallWayLoop home" className="flex shrink-0 items-center gap-2.5">
          <Image src="/icon.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-[17px] font-bold tracking-[-.04em]">HallwayLoop</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          <Link href="/dashboard" className="transition hover:text-foreground">Home</Link>
          <Link href="/societies" className="transition hover:text-foreground">Discover</Link>
          <Link href="/events" className="transition hover:text-foreground">Events</Link>
          <Link href="/about" className="transition hover:text-foreground">About HWL</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoggedIn && (
            <Link
              href="/messages"
              aria-label="Messages"
              className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
          )}
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex">
                My Loop
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/sign-in" className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
              Sign in
            </Link>
          )}
          <Link href={isLoggedIn ? "/events" : "/societies"} className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85 sm:inline-flex">
            {isLoggedIn ? "Explore events" : "Explore campus"} <span className="ml-1.5" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
