"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bell, Sparkles, Check, Globe, Loader2 } from "lucide-react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/connect/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to join the list. Please try again.");
      }

      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join the list. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#faf8f5] text-stone-900 selection:bg-amber-200 dark:bg-[#0c0a09] dark:text-stone-100">
      
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-amber-300/30 to-violet-400/30 blur-[120px] dark:from-amber-500/10 dark:to-violet-600/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-fuchsia-400/30 to-amber-300/30 blur-[120px] dark:from-fuchsia-600/10 dark:to-amber-500/10" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 lg:px-12">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm font-semibold text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400">
            In Active Development
          </span>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-3xl flex-col items-center px-6 py-12 text-center">
        
        {/* Campus Discovery Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70 dark:text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Something Special is Brewing</span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-5xl font-black tracking-tight text-stone-900 sm:text-6xl md:text-7xl dark:text-white">
          Connecting your <br />
          <span className="bg-gradient-to-r from-amber-500 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent">
            campus hallway.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400">
          We&apos;re crafting a space for student communities, societies, and late-night ideas to cross paths seamlessly. Get notified when Connect goes live.
        </p>

        {/* Subscription Form / Confirmation */}
        <div className="mt-10 w-full max-w-md">
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold">
                You&apos;re on the priority list! We&apos;ll be in touch soon.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
              <label htmlFor="email-input" className="sr-only">
                Email address
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your student or personal email..."
                className="h-13 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm text-stone-900 outline-none shadow-sm backdrop-blur-md transition-all placeholder:text-stone-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-stone-800 dark:bg-stone-900/80 dark:text-white dark:focus:border-amber-400 dark:focus:ring-amber-400/10"
              />
              <button
                type="submit"
                disabled={submitting}
                className="group flex h-13 shrink-0 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-stone-800 hover:shadow-xl dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                <span>{submitting ? "Sending..." : "Notify me"}</span>
                {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-stone-200/60 px-6 py-8 sm:flex-row lg:px-12 dark:border-stone-800/60">
        <p className="text-xs text-stone-500 dark:text-stone-500">
          © {new Date().getFullYear()} HallWayLoop. Where Campus Societies Come Alive.
        </p>

        <div className="flex items-center gap-4 text-stone-400 dark:text-stone-600">
          <a
            href="#"
            aria-label="Website"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-300"
          >
            <Globe className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-300"
          >
          
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-300"
          >
            
          </a>
        </div>
      </footer>
    </div>
  );
}