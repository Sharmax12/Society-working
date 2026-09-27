import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-neutral-900 font-sans selection:bg-yellow-200 selection:text-neutral-900">

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-900/15 bg-white text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live across campus clubs
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 max-w-4xl leading-[1.08] mb-6">
            Your campus isn't quiet. <br className="hidden sm:inline" />
            <span className="bg-amber-300 px-2 rounded-sm border-b-4 border-amber-500 inline-block mt-1">
              You’re just looking in the wrong place.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl font-normal leading-relaxed mb-8">
            Stop relying on dead WhatsApp group links and missed Instagram stories. HallWayLoop gathers every society showcase, late-night hackathon, and quad hangout in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/societies"
              className="px-6 py-3.5 text-base font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg border-2 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]"
            >
              Find a Society
            </Link>
            <Link
              href="/events"
              className="px-6 py-3.5 text-base font-bold text-neutral-900 bg-white hover:bg-neutral-50 rounded-lg border-2 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
            >
              See Today's Events
            </Link>
          </div>
        </section>

        {/* Asymmetric Bento Grid (Replaces generic 3-card layout) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {/* Card 1: Main Event Highlight */}
          <div className="md:col-span-7 bg-white border-2 border-neutral-900 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                  Happening Soon
                </span>
                <span className="text-xs font-mono text-neutral-500">Quad / Student Center</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 mb-2">
                Open Mic & Campus Jam Night
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Organized by the Music & Acoustics Society. Free entry for all freshers and seniors. Equipment provided on stage.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs font-bold">JD</div>
                <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs font-bold">AK</div>
                <div className="w-8 h-8 rounded-full bg-sky-400 border-2 border-white flex items-center justify-center text-xs font-bold">+42</div>
              </div>
              <Link href="/events" className="text-xs font-bold text-neutral-900 underline underline-offset-4 hover:text-amber-600">
                View Event Details →
              </Link>
            </div>
          </div>

          {/* Card 2: Society Spotlight */}
          <div className="md:col-span-5 bg-amber-100/70 border-2 border-neutral-900 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-neutral-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Society Directory</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 mb-2">
                40+ Active Clubs & Communities
              </h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-6">
                From competitive robotics and debate clubs to late-night film appreciation societies.
              </p>
            </div>

            <Link
              href="/societies"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-neutral-900 text-white font-bold text-sm rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Browse All Clubs
            </Link>
          </div>

          {/* Card 3: Connect / Micro Noticeboard */}
          <div className="md:col-span-12 bg-white border-2 border-neutral-900 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-950 mb-1">
                  Looking for project collaborators or study squads?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Connect with students who share your exact niche, tech stack, or hobby.
                </p>
              </div>
              <Link
                href="/Connect"
                className="shrink-0 px-5 py-2.5 bg-emerald-300 border border-neutral-900 text-neutral-950 font-bold text-sm rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] hover:bg-emerald-200 transition-all"
              >
                Join Campus Connect →
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}