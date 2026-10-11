import React from "react";
import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
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
import { signIn } from "@/auth";

async function handleGoogleSignIn() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

async function handleGithubSignIn() {
  "use server";
  await signIn("github", { redirectTo: "/dashboard" });
}

async function handleCredentialsSignIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/auth/sign-in?error=CredentialsSignin");
    }
    throw error;
  }
}

type SignInFormProps = {
  showCredentialsError?: boolean;
  registered?: boolean;
};

const SignInFormClient = ({
  showCredentialsError = false,
  registered = false,
}: SignInFormProps) => (
  <Card className="w-full overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
    <CardHeader className="px-7 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
      <CardTitle className="text-3xl font-black tracking-[-0.04em]">Welcome back</CardTitle>
      <CardDescription className="mt-2 text-sm leading-6">
        Sign in to discover societies, events and your campus community.
      </CardDescription>
    </CardHeader>

    <CardContent className="grid gap-4 px-7 sm:px-8">
      {registered && (
        <p role="status" className="rounded-xl border border-emerald-600/20 bg-emerald-600/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
          Your account has been created. Sign in with your email and password.
        </p>
      )}
      {showCredentialsError && (
        <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          Email or password was not recognised. Please try again.
        </p>
      )}

      <form action={handleCredentialsSignIn} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="local-email">Email address</Label>
          <Input id="local-email" name="email" type="email" autoComplete="email" placeholder="you@college.edu" maxLength={254} required className="h-11 rounded-xl" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="local-password">Password</Label>
          <Input id="local-password" name="password" type="password" autoComplete="current-password" maxLength={128} required className="h-11 rounded-xl" />
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl font-semibold">Sign in with email</Button>
      </form>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <form action={handleGoogleSignIn}>
          <Button type="submit" variant="outline" className="h-12 w-full rounded-xl border-foreground/10 bg-background/70 font-semibold transition hover:-translate-y-0.5 hover:shadow-md">
            <FaGoogle className="mr-2 h-4 w-4" /><span>Google</span>
          </Button>
        </form>
        <form action={handleGithubSignIn}>
          <Button type="submit" variant="outline" className="h-12 w-full rounded-xl border-foreground/10 bg-background/70 font-semibold transition hover:-translate-y-0.5 hover:shadow-md">
            <FaGithub className="mr-2 h-4 w-4" /><span>GitHub</span>
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to HallWayLoop?{" "}
        <Link href="/auth/register" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">Create an account</Link>
      </p>
    </CardContent>

    <CardFooter className="px-7 pb-7 pt-1 sm:px-8 sm:pb-8">
      <p className="w-full text-center text-[11px] leading-5 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/about" className="font-semibold underline underline-offset-2 hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="/about#trust" className="font-semibold underline underline-offset-2 hover:text-foreground">Privacy &amp; safety approach</Link>.
      </p>
    </CardFooter>
  </Card>
);

export default SignInFormClient;
