import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute inset-0 surface-grid opacity-60" />
      <div className="relative w-full max-w-xl text-center">
        {/* Animated badge icon */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xl shadow-primary/10">
          <Clock className="h-7 w-7 animate-pulse" />
        </div>

        {/* Eyebrow badge */}
        <p className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[.25em] text-primary">
          <Sparkles className="h-3 w-3" /> Under Construction
        </p>

        {/* Main Heading */}
        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] sm:text-6xl">
          Coming Soon.
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          We’re brewing something special for the hallway. This feature is currently under development and will be live shortly!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    </main>
  );
}