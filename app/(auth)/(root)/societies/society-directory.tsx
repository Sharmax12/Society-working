"use client";

import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, Users, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

type Society = { id: string; name: string; description: string; category: string | null; deadline: Date };

export function SocietyDirectory({ societies }: { societies: Society[] }) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredSocieties = societies.filter((society) => [society.name, society.description, society.category].some((value) => value?.toLowerCase().includes(normalizedSearch)));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === "Escape" && document.activeElement === inputRef.current) inputRef.current?.blur();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>
    <section className="relative overflow-hidden border-b border-foreground/10 surface-grid">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] text-primary"><Sparkles className="h-4 w-4" /> Campus discovery</div>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div><h1 className="text-balance text-5xl font-black tracking-[-.065em] sm:text-7xl">Find your <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">people.</span></h1><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Not sure where you fit yet? Take a look around. There&apos;s probably a room, team, stage, lab, or late-night idea waiting for you.</p></div>
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-foreground/10 bg-background/80 px-4 shadow-xl backdrop-blur-xl focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10"><Search className="h-5 w-5 text-primary" /><input ref={inputRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What are you into?" aria-label="Search societies" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />{search ? <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"><X className="h-3.5 w-3.5" /></button> : <span className="hidden rounded-lg bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground sm:block">⌘ K</span>}</label>
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-2xl font-black tracking-tight">Communities looking for people</h2><Badge className="rounded-full">{filteredSocieties.length}</Badge></div><p className="mt-1 text-sm text-muted-foreground">Have a look around. If something clicks, you can put your hand up.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /> Open to new members</div></div>
      {filteredSocieties.length === 0 ? <div className="rounded-[2rem] border border-dashed p-20 text-center text-muted-foreground"><Search className="mx-auto mb-4 h-7 w-7 opacity-50" /><p className="font-semibold text-foreground">Nothing quite matches that.</p><p className="mt-1 text-sm">Try another interest, category, or society name.</p>{search && <button type="button" onClick={() => setSearch("")} className="mt-5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background">Clear search</button>}</div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredSocieties.map((society, index) => <Link key={society.id} href={`/societies/${society.id}`} className="group relative overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" /><div className="relative"><div className="mb-8 flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Users className="h-5 w-5" /></div><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">Open now</span></div>{society.category && <Badge variant="secondary" className="mb-3 rounded-full capitalize">{society.category}</Badge>}<h3 className="text-xl font-black tracking-tight">{society.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{society.description}</p><div className="mt-7 flex items-center justify-between border-t border-foreground/10 pt-4 text-xs text-muted-foreground"><span>Applications close {new Date(society.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><span className="flex items-center gap-1 font-bold text-foreground">See what they&apos;re about <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div></div></Link>)}</div>}
    </div>
  </>;
}
