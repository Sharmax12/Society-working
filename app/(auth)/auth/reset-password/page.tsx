import type { Metadata } from "next";
import Link from "next/link";
import { resetPassword } from "@/modules/auth/local-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ token?: string; error?: string }> };

const messages: Record<string, string> = {
  invalid: "This reset link is invalid, expired, or already used. Request a fresh link.",
  password: "Choose a password between 10 and 128 characters.",
  mismatch: "The passwords do not match. Please try again.",
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const tokenLooksValid = /^[A-Za-z0-9_-]{40,60}$/.test(token);
  return (
    <Card className="w-full rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10">
      <CardHeader className="px-7 pb-5 pt-7 sm:px-8">
        <CardTitle className="text-2xl font-black tracking-tight">Choose a new password</CardTitle>
        <CardDescription className="leading-6">Reset links expire after 30 minutes and can only be used once. Resetting your password signs out existing sessions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-7 pb-7 sm:px-8">
        {params.error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{messages[params.error] ?? messages.invalid}</p>}
        {tokenLooksValid ? (
          <form action={resetPassword} className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" name="password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input id="confirm-new-password" name="confirmPassword" type="password" minLength={10} maxLength={128} autoComplete="new-password" required className="h-11 rounded-xl" />
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl">Save new password</Button>
          </form>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">The reset link is missing or malformed.</p>
            <Link href="/auth/forgot-password" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Request another link</Link>
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground"><Link href="/auth/sign-in" className="font-semibold underline underline-offset-4">Back to sign in</Link></p>
      </CardContent>
    </Card>
  );
}
