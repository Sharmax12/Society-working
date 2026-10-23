"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SignInFormProps = {
  showCredentialsError?: boolean;
  verificationSent?: boolean;
  verified?: boolean;
  passwordReset?: boolean;
};

export default function SignInFormClient({
  showCredentialsError = false,
  verificationSent = false,
  verified = false,
  passwordReset = false,
}: SignInFormProps) {
  const [busy, setBusy] = useState(false);
  const [credentialsError, setCredentialsError] = useState(showCredentialsError);
  const [authError, setAuthError] = useState("");

  async function handleCredentialsSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    setBusy(true);
    setCredentialsError(false);
    setAuthError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (!result || result.error || !result.ok || !result.url) {
        setCredentialsError(true);
        return;
      }

      // A full navigation refreshes the server-rendered session and destination.
      window.location.assign(result.url);
    } catch {
      setAuthError("Sign-in could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    if (busy) return;

    setBusy(true);
    setAuthError("");
    setCredentialsError(false);

    try {
      const result = await signIn("google", {
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (!result || result.error || !result.url) {
        setAuthError("Google sign-in could not be started. Please try again.");
        setBusy(false);
        return;
      }

      // Navigate directly to the provider URL returned by Auth.js.
      window.location.assign(result.url);
    } catch {
      setAuthError("Google sign-in could not be started. Please try again.");
      setBusy(false);
    }
  }

  return (
    <Card className="w-full overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <CardHeader className="px-7 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
        <CardTitle className="text-3xl font-black tracking-[-0.04em]">Welcome back</CardTitle>
        <CardDescription className="mt-2 text-sm leading-6">
          Sign in to discover societies, events and your campus community.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 px-7 sm:px-8">
        {verificationSent && (
          <p role="status" className="rounded-xl border bg-muted/50 p-3 text-sm">
            If your account was created or still needs verification, a verification email has been requested. Confirm your address before signing in.
            {" "}<Link href="/auth/verify-email" className="font-semibold underline underline-offset-2">Resend link</Link>
          </p>
        )}
        {verified && (
          <p role="status" className="rounded-xl border border-emerald-600/20 bg-emerald-600/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
            Email verified. You can now sign in.
          </p>
        )}
        {passwordReset && (
          <p role="status" className="rounded-xl border border-emerald-600/20 bg-emerald-600/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
            Password reset complete. Your other sessions have been revoked; sign in with the new password.
          </p>
        )}
        {credentialsError && (
          <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            Email or password was not recognised. Please try again.
          </p>
        )}
        {authError && (
          <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {authError}
          </p>
        )}

        <form onSubmit={handleCredentialsSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="local-email">Email address</Label>
            <Input id="local-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required className="h-11 rounded-xl" disabled={busy} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="local-password">Password</Label>
            <Input id="local-password" name="password" type="password" autoComplete="current-password" maxLength={128} required className="h-11 rounded-xl" disabled={busy} />
            <div className="flex justify-between gap-3 text-xs">
              <Link href="/auth/verify-email" className="font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground">Verify email</Link>
              <Link href="/auth/forgot-password" className="font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground">Forgot password?</Link>
            </div>
          </div>
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl font-semibold">
            {busy ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => void handleGoogleSignIn()}
          className="h-12 w-full rounded-xl border-foreground/10 bg-background/70 font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          <span>{busy ? "Connecting…" : "Continue with Google"}</span>
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to HallWayLoop?{" "}
          <Link href="/auth/register" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">Create an account</Link>
        </p>
      </CardContent>

      <CardFooter className="px-7 pb-7 pt-1 sm:px-8 sm:pb-8">
        <p className="w-full text-center text-[11px] leading-5 text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-semibold underline underline-offset-2 hover:text-foreground">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
        </p>
      </CardFooter>
    </Card>
  );
}
