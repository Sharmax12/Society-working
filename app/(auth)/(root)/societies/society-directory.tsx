"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bell, Search, Users, X, Clock3, Archive } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

type Society = {
  id: string;
  name: string;
  description: string;
  category: string | null;
  deadline: Date | string;
  isOpen: boolean;
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
    [society.name, society.description, society.category].some((value) => value?.toLowerCase().includes(normalizedSearch))
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) inputRef.current?.blur();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Find your community</p>
          <div className="mt-5 grid gap-8 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-.055em] sm:text-6xl">Your people are <span className="text-muted-foreground">out there.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Explore campus societies, find your interests and discover where you could belong.</p>
            </div>
            <label className="flex h-12 items-center gap-3 rounded-full border border-border bg-card px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input ref={inputRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search societies" aria-label="Search societies" className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none ring-0 focus:ring-0" />
              {search ? <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button> : <span className="hidden text-[10px] text-muted-foreground sm:inline">⌘ K</span>}
            </label>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-tight">{section === "open" ? "Open applications" : "Closed applications"} <span className="ml-2 text-sm font-normal text-muted-foreground">{visibleSocieties.length}</span></h2><p className="mt-1 text-sm text-muted-foreground">{section === "open" ? "Places you can apply to right now." : "Societies with closed or expired application windows."}</p></div>
          <div className="inline-flex w-fit rounded-full border border-border p-1" role="tablist" aria-label="Society application status">
            <button role="tab" aria-selected={section === "open"} onClick={() => setSection("open")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${section === "open" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}><Clock3 className="h-3.5 w-3.5" />Open <span className="text-xs opacity-75">{openSocieties.length}</span></button>
            <button role="tab" aria-selected={section === "closed"} onClick={() => setSection("closed")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${section === "closed" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}><Archive className="h-3.5 w-3.5" />Closed <span className="text-xs opacity-75">{closedSocieties.length}</span></button>
          </div>
        </div>

        {visibleSocieties.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <Search className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-4 font-semibold">{normalizedSearch ? "No matching societies" : section === "open" ? "No open applications right now" : "No closed societies to show"}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {normalizedSearch
                ? "Try another search, or clear the query to browse all listed societies."
                : section === "open"
                  ? "Application windows are set by each society. Get HallWayLoop updates or tell us about a society that should be listed."
                  : "There are no closed applications to display right now. You can still help bring more societies onto HallWayLoop."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {normalizedSearch && <button type="button" onClick={() => setSearch("")} className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">Clear search</button>}
              <Link href="/connect-launch" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"><Bell className="h-4 w-4" /> Get updates</Link>
              <Link href="/for-societies" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-85">List your society <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSocieties.map((society) => {
              const expired = new Date(society.deadline).getTime() <= now;
              const accepting = society.isOpen && !expired;
              return (
                <Link key={society.id} href={`/societies/${society.id}`} className="group flex min-h-[240px] flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/[.04]">
                  <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted"><Users className="h-4 w-4 text-muted-foreground" /></span><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${accepting ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>{accepting ? "Open now" : "Closed"}</span></div>
                  {society.category && <Badge variant="secondary" className="mt-5 w-fit rounded-full font-medium capitalize">{society.category}</Badge>}
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{society.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{society.description}</p>
                  <div className="mt-auto mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground"><span>{expired ? "Deadline passed" : accepting ? "Closes" : "Applications closed"} · {new Date(society.deadline).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short", day: "numeric", year: "numeric" })}</span><span className="inline-flex items-center gap-1 font-medium text-foreground">View <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
