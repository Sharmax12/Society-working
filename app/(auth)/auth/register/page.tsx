import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerLocalAccount } from "@/modules/auth/local-actions";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a HallWayLoop account with your email and password.",
  robots: { index: false, follow: false },
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  invalid: "Enter your name and a valid email address.",
  password: "Choose a password between 10 and 128 characters.",
  mismatch: "The passwords do not match. Please try again.",
  exists: "An account with this email may already exist. Try signing in instead.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : undefined;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center sm:mb-7">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border bg-card shadow-lg shadow-primary/10">
          <Image src="/login.svg" alt="" height={34} width={34} className="object-contain" priority />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">HallWayLoop</p>
      </div>

      <Card className="w-full overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader className="px-7 pb-5 pt-7 sm:px-8 sm:pt-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[.18em] text-primary">Join your campus</p>
          <CardTitle className="mt-2 text-center text-3xl font-black tracking-[-0.04em]">Create an account</CardTitle>
          <CardDescription className="mt-2 text-center text-sm leading-6">
            Use one email and password for your HallWayLoop account.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pb-7 sm:px-8 sm:pb-8">
          {errorMessage && (
            <p role="alert" className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <form action={registerLocalAccount} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="register-name">Full name</Label>
              <Input id="register-name" name="name" autoComplete="name" maxLength={80} required className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-email">Email address</Label>
              <Input id="register-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@college.edu" required className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">Create password</Label>
              <Input id="register-password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required className="h-11 rounded-xl" />
              <p className="text-xs leading-5 text-muted-foreground">Use at least 10 characters.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-confirm-password">Confirm password</Label>
              <Input id="register-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} maxLength={128} required className="h-11 rounded-xl" />
            </div>
            <Button type="submit" className="mt-1 h-12 w-full rounded-xl font-semibold">Create account</Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">Sign in</Link>
          </p>
          <p className="mt-5 rounded-xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
            Use your college email where possible. Creating an account does not by itself verify college affiliation; access rules for college-only features must be enforced separately.
          </p>
          <Link href="/" className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to HallWayLoop
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
