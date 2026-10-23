"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, House, UserRound, UsersRound } from "lucide-react";

type Props = { isLoggedIn: boolean };

const items = [
  { label: "My Loop", href: "/dashboard", icon: House },
  { label: "Discover", href: "/societies", icon: Compass },
  { label: "Connect", href: "/connect", icon: UsersRound },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function MobileAppNav({ isLoggedIn }: Props) {
  const pathname = usePathname();
  if (!isLoggedIn || pathname.startsWith("/auth")) return null;

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_28px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className={
                  active
                    ? "grid h-8 w-10 place-items-center rounded-xl bg-muted text-foreground"
                    : "grid h-8 w-10 place-items-center rounded-xl text-muted-foreground group-hover:text-foreground"
                }
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.9} />
              </span>
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
