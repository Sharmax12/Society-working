import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/modules/auth/local-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ status?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <Card className="w-full rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10">
      <CardHeader className="px-7 pb-5 pt-7 sm:px-8">
        <CardTitle className="text-2xl font-black tracking-tight">Reset your password</CardTitle>
        <CardDescription className="leading-6">Enter the email address on your HallWayLoop account. If an eligible account exists, we'll send a single-use reset link.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-7 pb-7 sm:px-8">
        {params.status === "sent" && <p role="status" className="rounded-xl border bg-muted/50 p-3 text-sm">If a verified account with a password matches that address, a reset link will arrive shortly. If not, nothing changes.</p>}
        <form action={requestPasswordReset} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="reset-email">College email address</Label>
            <Input id="reset-email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@college.edu" className="h-11 rounded-xl" />
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl">Send reset link</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground"><Link href="/auth/sign-in" className="font-semibold underline underline-offset-4">Back to sign in</Link></p>
      </CardContent>
    </Card>
  );
}
