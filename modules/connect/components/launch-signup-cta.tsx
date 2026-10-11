"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Bell, Check, Loader2 } from "lucide-react";

export function LaunchSignupCTA() {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/connect/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: { success?: boolean; error?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "We couldn't add you to the updates list. Please try again.");
      }

      setSubmitted(true);
      setEmail("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn't add you to the updates list. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p role="status" className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/5 px-5 py-3.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        <Check className="h-4 w-4" /> You’re on the updates list
      </p>
    );
  }

  return (
    <div className="w-full sm:w-auto">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
        >
          Get notified at launch <Bell className="h-4 w-4" />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-2 sm:w-[380px] sm:flex-row">
          <label htmlFor="homepage-launch-email" className="sr-only">Email address for launch updates</label>
          <input
            id="homepage-launch-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="h-10 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {submitting ? "Joining…" : "Join list"}
          </button>
          {error && <p role="alert" className="text-xs text-destructive sm:absolute sm:mt-12">{error}</p>}
        </form>
      )}
    </div>
  );
}
