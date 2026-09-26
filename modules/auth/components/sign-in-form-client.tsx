import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/auth";

async function handleGoogleSignIn() { "use server"; await signIn("google"); }
async function handleGithubSignIn() { "use server"; await signIn("github"); }

const SignInFormClient = () => (
  <Card className="w-full overflow-hidden rounded-[1.75rem] border-foreground/10 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
    <CardHeader className="px-7 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
      <CardTitle className="text-3xl font-black tracking-[-0.04em]">Welcome back</CardTitle>
      <CardDescription className="mt-2 text-sm leading-6">Sign in to discover societies, events and your campus community.</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-3 px-7 sm:px-8">
      <form action={handleGoogleSignIn}>
        <Button type="submit" variant="outline" className="h-12 w-full rounded-xl border-foreground/10 bg-background/70 font-semibold transition hover:-translate-y-0.5 hover:shadow-md">
          <FaGoogle className="mr-2 h-4 w-4" /><span>Continue with Google</span>
        </Button>
      </form>
      <form action={handleGithubSignIn}>
        <Button type="submit" variant="outline" className="h-12 w-full rounded-xl border-foreground/10 bg-background/70 font-semibold transition hover:-translate-y-0.5 hover:shadow-md">
          <FaGithub className="mr-2 h-4 w-4" /><span>Continue with GitHub</span>
        </Button>
      </form>
    </CardContent>
    <CardFooter className="px-7 pb-7 pt-5 sm:px-8 sm:pb-8">
      <p className="w-full text-center text-[11px] leading-5 text-muted-foreground">By continuing, you agree to our <a href="#" className="font-semibold underline underline-offset-2 hover:text-foreground">Terms</a> and <a href="#" className="font-semibold underline underline-offset-2 hover:text-foreground">Privacy Policy</a>.</p>
    </CardFooter>
  </Card>
);

export default SignInFormClient;