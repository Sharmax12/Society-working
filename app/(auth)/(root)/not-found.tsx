import Link from "next/link";
import { ArrowLeft, Compass, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute inset-0 surface-grid opacity-60" />
      <div className="relative w-full max-w-xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xl shadow-primary/10">
          <SearchX className="h-7 w-7" />
        </div>
        <p className="mt-7 text-[11px] font-black uppercase tracking-[.25em] text-primary">Lost between halls</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] sm:text-6xl">This page moved.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">The page you’re looking for doesn’t exist anymore, or the link is out of date.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:-translate-y-0.5 hover:shadow-xl"><ArrowLeft className="h-4 w-4" /> Back home</Link>
          <Link href="/societies" className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 bg-card px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-primary/30"><Compass className="h-4 w-4 text-primary" /> Discover societies</Link>
        </div>
      </div>
    </main>
  );
}
