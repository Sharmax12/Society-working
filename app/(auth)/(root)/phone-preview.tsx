"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Compass,
  Home as HomeIcon,
  MessageCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

type Destination = "home" | "discover" | "events" | "messages";

const destinations: { id: Destination; label: string; icon: typeof HomeIcon }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "discover", label: "Discover", icon: Search },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "messages", label: "Messages", icon: MessageCircle },
];

export function PhonePreview() {
  const [active, setActive] = useState<Destination>("home");

  const titles: Record<Destination, string> = {
    home: "Your campus, today.",
    discover: "Find your people.",
    events: "What's happening?",
    messages: "Keep in touch.",
  };

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div aria-hidden="true" className="absolute inset-x-10 top-10 -z-10 h-3/4 rounded-full bg-primary/10 blur-3xl" />
      <div className="rounded-[2.8rem] border-[7px] border-stone-900 bg-stone-900 p-2 shadow-2xl shadow-stone-950/20">
        <div className="overflow-hidden rounded-[2.1rem] bg-[#faf8f3] text-[#29231f]">
          <div className="flex items-center justify-between px-5 pb-2 pt-3 text-[10px] font-semibold">
            <span>9:41</span>
            <span className="tracking-[.16em]" aria-label="Signal and battery">● ● ●</span>
          </div>
          <div className="px-4 pb-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#b94131]">HALLWAYLOOP</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">{titles[active]}</p>
              </div>
              <div className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e6dcd3] bg-white">
                <span className="text-base font-semibold" aria-hidden="true">@</span>
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d95743]" />
              </div>
            </div>

            <div className="mt-5 min-h-[250px]">
              {active === "home" && (
                <div>
                  <div className="rounded-2xl bg-[#302724] p-4 text-white">
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.17em] text-white/65">
                      <Sparkles className="h-3.5 w-3.5" /> Campus note · sample
                    </div>
                    <p className="mt-3 text-lg font-semibold leading-snug">Something good is happening around the corner.</p>
                    <p className="mt-2 text-xs leading-5 text-white/70">Short updates from the people and societies you follow.</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">Around your campus</p>
                    <span className="text-[10px] font-medium text-[#9a8b80]">SAMPLE FEED</span>
                  </div>
                  <article className="mt-3 rounded-2xl border border-[#e8ded6] bg-white p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5ded6] text-[10px] font-bold text-[#9b493b]">DS</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">Design Society</p>
                        <p className="mt-0.5 text-[10px] text-[#9a8b80]">Society update · Example</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#9a8b80]" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">A new idea starts with showing up.</p>
                    <p className="mt-1 text-xs leading-5 text-[#786a61]">Announcements, student posts, and achievements in one feed.</p>
                  </article>
                </div>
              )}

              {active === "discover" && (
                <div>
                  <div className="rounded-2xl border border-[#e8ded6] bg-white p-4">
                    <div className="flex items-center gap-2 rounded-xl border border-[#e8ded6] bg-[#faf8f3] px-3 py-2 text-xs text-[#9a8b80]">
                      <Search className="h-3.5 w-3.5" /> Societies, people, interests
                    </div>
                    <p className="mt-4 text-sm font-semibold">Communities to explore</p>
                    <p className="mt-1 text-[10px] text-[#9a8b80]">EXAMPLE RESULTS</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl bg-[#f5ded6]/70 p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#9b493b]"><Compass className="h-4 w-4" /></div>
                        <div><p className="text-xs font-semibold">Design Society</p><p className="mt-0.5 text-[10px] text-[#786a61]">Design · Creative projects</p></div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-[#e6eadb]/70 p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#526344]"><Users className="h-4 w-4" /></div>
                        <div><p className="text-xs font-semibold">Robotics Club</p><p className="mt-0.5 text-[10px] text-[#786a61]">Engineering · Build together</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === "events" && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Events near you</p>
                    <span className="text-[10px] font-medium text-[#9a8b80]">SAMPLE</span>
                  </div>
                  <article className="mt-3 rounded-2xl border border-[#e8ded6] bg-white p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e6eadb] text-center text-[#526344]">
                        <CalendarDays className="h-4 w-4" /><span className="text-[8px] font-bold">FRI</span>
                      </div>
                      <div><p className="text-xs font-semibold">Creative workshop</p><p className="mt-1 text-[10px] text-[#9a8b80]">Campus studio · Example</p><p className="mt-2 text-xs leading-5 text-[#786a61]">Make something with people who share your interests.</p></div>
                    </div>
                  </article>
                  <article className="mt-3 rounded-2xl border border-[#e8ded6] bg-white p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5ded6] text-[#9b493b]"><Users className="h-4 w-4" /></div>
                      <div><p className="text-xs font-semibold">Society open house</p><p className="mt-1 text-[10px] text-[#9a8b80]">Meet the community · Example</p></div>
                    </div>
                  </article>
                </div>
              )}

              {active === "messages" && (
                <div className="rounded-2xl border border-[#e8ded6] bg-white p-4">
                  <div className="flex items-center gap-3 border-b border-[#e8ded6] pb-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e6eadb] text-[#526344]"><Users className="h-4 w-4" /></div>
                    <div><p className="text-xs font-semibold">Campus friends</p><p className="mt-0.5 text-[10px] text-[#9a8b80]">Example conversation</p></div>
                  </div>
                  <div className="mt-4 space-y-3 text-xs">
                    <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-[#f2ece5] px-3 py-2.5 text-[#51453e]">Are you going to the workshop?</p>
                    <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-[#d95743] px-3 py-2.5 text-white">Yes! See you there.</p>
                    <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-[#f2ece5] px-3 py-2.5 text-[#51453e]">Great, I'll save you a seat.</p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#e8ded6] px-3 py-2 text-[10px] text-[#9a8b80]">
                    <MessageCircle className="h-3.5 w-3.5" /> Example message · not a live chat
                  </div>
                </div>
              )}
            </div>

            <nav aria-label="App preview destinations" className="mt-4 grid grid-cols-4 gap-1 border-t border-[#e8ded6] pt-3">
              {destinations.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`Preview ${label}`}
                  aria-pressed={active === id}
                  onClick={() => setActive(id)}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[#9a8b80] transition hover:bg-[#f2ece5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95743] ${active === id ? "font-semibold text-[#b94131]" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[9px]">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">Interactive app preview · sample content, not live posts</p>
    </div>
  );
}
