"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute inset-0 surface-grid opacity-60" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-foreground/10 bg-card p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive"><AlertTriangle className="h-6 w-6" /></div>
        <p className="mt-6 text-[11px] font-black uppercase tracking-[.24em] text-muted-foreground">Something went sideways</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">We hit a small campus glitch.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Your data is safe. Try the page again, and we’ll pick up where you left off.</p>
        <button onClick={() => reset()} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RefreshCw className="h-4 w-4" /> Try again</button>
      </section>
    </main>
  );
}
