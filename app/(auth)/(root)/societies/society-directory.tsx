"use client";

import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type Society = {
  id: string;
  name: string;
  description: string;
  category: string | null;
  deadline: Date;
};

export function SocietyDirectory({ societies }: { societies: Society[] }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredSocieties = societies.filter((society) =>
    [society.name, society.description, society.category].some((value) =>
      value?.toLowerCase().includes(normalizedSearch),
    ),
  );

  return (
    <>
      <section className="border-b bg-gradient-to-b from-rose-500/[.07] via-background to-background">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-rose-500"><Sparkles className="h-4 w-4" /> Campus discovery</div>
          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><h1 className="text-4xl font-black tracking-[-.04em] sm:text-6xl">Find your <span className="text-rose-500">people.</span></h1><p className="mt-4 max-w-xl text-muted-foreground">Explore societies accepting applications and find the communities where you can learn, build and belong.</p></div>
            <label className="mx-auto flex h-11 w-full max-w-sm items-center gap-2 rounded-xl border bg-background/70 px-3 shadow-sm">
  <Search className="h-4 w-4 text-muted-foreground" />
  <input
    type="search"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search societies..."
    aria-label="Search societies"
    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
  />
</label>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Open for applications</h2>
            <p className="text-sm text-muted-foreground">Choose a community that feels like you.</p>
          </div>
          <Badge variant="secondary">{filteredSocieties.length} open</Badge>
        </div>
        {filteredSocieties.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-14 text-center text-muted-foreground">
            No societies match your search.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredSocieties.map((society) => (
              <Link
                key={society.id}
                href={`/societies/${society.id}`}
                className="group rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
              >
                <div className="mb-7 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                {society.category && <Badge variant="secondary" className="mb-3 capitalize">{society.category}</Badge>}
                <h3 className="text-xl font-bold tracking-tight">{society.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{society.description}</p>
                <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">
                  Applications close {new Date(society.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}