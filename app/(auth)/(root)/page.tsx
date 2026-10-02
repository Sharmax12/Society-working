import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";


export default function Home() {
  const websiteJsonLd = buildWebsiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-amber-300 dark:selection:bg-amber-500 selection:text-neutral-900 transition-colors duration-200">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-900/15 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live across campus clubs
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white max-w-4xl leading-[1.08] mb-6">
            Your campus isn't quiet. <br className="hidden sm:inline" />
            <span className="bg-amber-300 dark:bg-amber-500 dark:text-neutral-950 px-2 rounded-sm border-b-4 border-amber-500 dark:border-amber-400 inline-block mt-1">
              You’re just looking in the wrong place.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl font-normal leading-relaxed mb-8">
            Stop relying on dead WhatsApp group links and missed Instagram stories. HallWayLoop gathers every society showcase, late-night hackathon, and quad hangout in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/societies"
              className="px-6 py-3.5 text-base font-bold text-white dark:text-neutral-950 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg border-2 border-neutral-900 dark:border-neutral-100 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]"
            >
              Find a Society
            </Link>
            <Link
              href="/events"
              className="px-6 py-3.5 text-base font-bold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg border-2 border-neutral-900 dark:border-neutral-100 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
            >
              See Today's Events
            </Link>
          </div>
        </section>

        {/* Asymmetric Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-5">
          {/* Card 1: Main Event Highlight */}
          <div className="md:col-span-7 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                  Happening Soon
                </span>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Quad / Student Center</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">
                Open Mic & Campus Jam Night
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6">
                Organized by the Music & Acoustics Society. Free entry for all freshers and seniors. Equipment provided on stage.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 dark:bg-amber-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-900">JD</div>
                <div className="w-8 h-8 rounded-full bg-emerald-400 dark:bg-emerald-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-900">AK</div>
                <div className="w-8 h-8 rounded-full bg-sky-400 dark:bg-sky-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-900">+42</div>
              </div>
              <Link href="/events" className="text-xs font-bold text-neutral-900 dark:text-neutral-100 underline underline-offset-4 hover:text-amber-600 dark:hover:text-amber-400">
                View Event Details →
              </Link>
            </div>
          </div>

          {/* Card 2: Society Spotlight */}
          <div className="md:col-span-5 bg-amber-100/70 dark:bg-amber-950/30 border-2 border-neutral-900 dark:border-neutral-100 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-neutral-900 dark:border-neutral-100" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-amber-300">Society Directory</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">
                40+ Active Clubs & Communities
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-6">
                From competitive robotics and debate clubs to late-night film appreciation societies.
              </p>
            </div>

            <Link
              href="/societies"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-sm rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              Browse All Clubs
            </Link>
          </div>

          {/* Card 3: Connect / Micro Noticeboard */}
          <div className="md:col-span-12 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 rounded-2xl p-7 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-1">
                  Looking for project collaborators or study squads?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  Connect with students who share your exact niche, tech stack, or hobby.
                </p>
              </div>
              <Link
                href="/Connect"
                className="shrink-0 px-5 py-2.5 bg-emerald-300 dark:bg-emerald-400 border border-neutral-900 dark:border-neutral-100 text-neutral-950 font-bold text-sm rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] hover:bg-emerald-200 dark:hover:bg-emerald-300 transition-all"
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
