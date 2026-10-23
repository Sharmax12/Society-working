import type { Metadata } from "next";
import Link from "next/link";
import { requestEmailVerification, verifyEmail } from "@/modules/auth/local-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string; error?: string; status?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const tokenLooksValid = /^[A-Za-z0-9_-]{40,60}$/.test(token);

  return (
    <Card className="w-full rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10">
      <CardHeader className="px-7 pb-5 pt-7 sm:px-8">
        <CardTitle className="text-2xl font-black tracking-tight">{token ? "Confirm your email" : "Send a verification link"}</CardTitle>
        <CardDescription className="leading-6">
          {token ? "Submit this confirmation to activate your account. Opening the link alone does not consume it." : "Enter your college email and we&apos;ll send a fresh link if an unverified account exists."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-7 pb-7 sm:px-8">
        {params.error === "invalid" && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">That verification link is invalid, expired, or already used. Request a fresh link below.</p>}
        {params.status === "sent" && <p role="status" className="rounded-xl border bg-muted/50 p-3 text-sm">If an unverified account matches that address, a verification email has been sent. Check your inbox and spam folder.</p>}
        {token && tokenLooksValid && (
          <form action={verifyEmail} className="grid gap-3">
            <input type="hidden" name="token" value={token} />
            <Button type="submit" className="h-11 w-full rounded-xl">Verify email address</Button>
          </form>
        )}
        {token && !tokenLooksValid && <p role="alert" className="text-sm text-destructive">The link format is invalid. Request a new one below.</p>}
        <div className="border-t pt-4">
          <form action={requestEmailVerification} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="verify-email">College email address</Label>
              <Input id="verify-email" type="email" name="email" maxLength={254} autoComplete="email" required placeholder="you@college.edu" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" variant="outline" className="h-11 w-full rounded-xl">Resend verification email</Button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground"><Link href="/auth/sign-in" className="font-semibold underline underline-offset-4">Back to sign in</Link></p>
      </CardContent>
    </Card>
  );
}
