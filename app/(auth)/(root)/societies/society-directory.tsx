"use client";

import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, Users, SlidersHorizontal, X, Clock3, Archive } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

type Society = { 
  id: string; 
  name: string; 
  description: string; 
  category: string | null; 
  deadline: Date | string; 
  isOpen: boolean 
};

type Section = "open" | "closed";

export function SocietyDirectory({ societies }: { societies: Society[] }) {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<Section>("open");
  const [now, setNow] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const { openSocieties, closedSocieties } = useMemo(() => {
    const open: Society[] = [];
    const closed: Society[] = [];
    societies.forEach((society) => {
      if (society.isOpen && new Date(society.deadline).getTime() > now) open.push(society);
      else closed.push(society);
    });
    return { openSocieties: open, closedSocieties: closed };
  }, [societies, now]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleSocieties = (section === "open" ? openSocieties : closedSocieties).filter((society) =>
    [society.name, society.description, society.category].some((value) => 
      value?.toLowerCase().includes(normalizedSearch)
    )
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { 
        event.preventDefault(); 
        inputRef.current?.focus(); 
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 lg:px-10 lg:pt-14">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] text-primary">
            <Sparkles className="h-4 w-4" /> Campus discovery
          </div>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-foreground">
                Find your{' '}
                <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                  people.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Not sure where you fit yet? Take a look around. There&apos;s probably a room, team, stage, lab, or late-night idea waiting for you.
              </p>
            </div>

            {/* Search Input */}
            <label className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 shadow-md backdrop-blur-xl transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="What are you into?"
                aria-label="Search societies"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="hidden rounded-lg bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground sm:block">
                  ⌘ K
                </span>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* Directory Grid & Controls */}
      <div className="mx-auto max-w-7xl px-5 pt-2 pb-12 sm:px-8 lg:px-10">
        <div className="mt-10 mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black tracking-tight text-foreground">
              {section === "open" ? "Communities looking for people" : "Applications have closed"}
            </h3>
            <Badge className="rounded-full">{visibleSocieties.length}</Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            {section === "open" ? "Open to new members" : "Past deadlines & closed listings"}
          </div>
        </div>

        {/* Description Subtext */}
        <p className="mb-6 text-sm text-muted-foreground">
          {section === "open"
            ? "These societies are still accepting applications."
            : "Deadlines have passed or applications were closed by their admins."}
        </p>
        
        {/* Section Header: Left Title / Subtitle + Right Filter Tabs */}
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-start sm:justify-left sm:gap-6 lg:items-center lg:justify-between">
          
          {/* Open/Closed Filter Tabs (Left side of controls) */}
          <div className="inline-flex shrink-0 rounded-2xl border border-border bg-card p-1.5 shadow-sm" role="tablist" aria-label="Society application status">
            <button
              role="tab"
              aria-selected={section === "open"}
              onClick={() => setSection("open")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                section === "open"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock3 className="h-4 w-4" /> Open <span className="text-xs opacity-80">{openSocieties.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={section === "closed"}
              onClick={() => setSection("closed")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                section === "closed"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Archive className="h-4 w-4" /> Closed <span className="text-xs opacity-80">{closedSocieties.length}</span>
            </button>
          </div>
        </div>

       
        

        {/* Empty State vs Cards Display */}
        {visibleSocieties.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border p-16 text-center text-muted-foreground">
            <Search className="mx-auto mb-4 h-7 w-7 opacity-50" />
            <p className="font-semibold text-foreground">
              {normalizedSearch
                ? "Nothing quite matches that."
                : section === "open"
                ? "No open applications right now."
                : "No closed societies to show yet."}
            </p>
            <p className="mt-1 text-sm">
              {normalizedSearch
                ? "Try another interest, category, or society name."
                : section === "open"
                ? "Check back soon—new opportunities will show up here."
                : "Societies will appear here once their application window closes."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background transition hover:opacity-90"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleSocieties.map((society) => {
              const expired = new Date(society.deadline).getTime() <= now;
              const accepting = society.isOpen && !expired;
              return (
                <Link
                  key={society.id}
                  href={`/societies/${society.id}`}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
                  <div className="relative">
                    <div className="mb-8 flex items-start justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                          accepting
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {accepting ? "Open now" : "Closed"}
                      </span>
                    </div>

                    {society.category && (
                      <Badge variant="secondary" className="mb-3 rounded-full capitalize">
                        {society.category}
                      </Badge>
                    )}

                    <h4 className="text-xl font-black tracking-tight text-foreground">{society.name}</h4>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {society.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                      <span>
                        {expired ? "Deadline passed" : accepting ? "Closes" : "Applications closed"} ·{" "}
                        {new Date(society.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-foreground">
                        View society{" "}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}