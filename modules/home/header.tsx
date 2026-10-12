import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/auth";
import { SignOutButton } from "@/modules/auth/components/sign-out";

const navigation = [
  { href: "/societies", label: "Societies" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

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

        <nav aria-label="Main navigation" className="hidden items-center gap-4 text-sm text-muted-foreground xl:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex">
                My space
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/sign-in" className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
              Sign in
            </Link>
          )}
          <Link href="/societies" className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85 sm:inline-flex">
            Explore campus <span className="ml-1.5" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <nav aria-label="Mobile navigation" className="flex gap-5 overflow-x-auto border-t border-border/70 px-5 py-3 text-sm text-muted-foreground lg:hidden">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-foreground">
            {item.label}
          </Link>
        ))}
        {isLoggedIn && <Link href="/messages" className="whitespace-nowrap hover:text-foreground">Messages</Link>}
        {isLoggedIn && <Link href="/dashboard" className="whitespace-nowrap hover:text-foreground">My space</Link>}
      </nav>
    </header>
  );
}
