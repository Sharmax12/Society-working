"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type LeadKind = "society" | "college";

export function CampusLeadForm({
  kind,
  title,
  description,
}: {
  kind: LeadKind;
  title: string;
  description: string;
}) {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/campus-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization, email, kind, website }),
      });
      const result: { success?: boolean; error?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "We couldn't send your details. Please try again.");
      }

      setSubmitted(true);
      setName("");
      setOrganization("");
      setEmail("");
      setWebsite("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn't send your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {submitted ? (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-600/5 p-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
          <div>
            <p className="font-semibold">Thanks — your details have been sent.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The HallWayLoop team can reply to the email address you provided.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Your name
              <input
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                required
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Name"
              />
            </label>
            <label className="block text-sm font-medium">
              {kind === "society" ? "Society name" : "College / institution"}
              <input
                name="organization"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                maxLength={160}
                required
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={kind === "society" ? "Your society" : "Your college"}
              />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={254}
                required
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label>
              Leave this field empty
              <input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </label>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {submitting ? "Sending details…" : kind === "society" ? "Send society details" : "Request a campus conversation"}
          </button>
        </form>
      )}
    </div>
  );
}
