import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { PostsFeed } from "@/modules/posts/posts-feed";

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-muted">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <header className="mt-7 mb-7">
          <div className="flex items-center gap-3 text-violet-500"><MessageCircle className="h-5 w-5" /><p className="text-xs font-black uppercase tracking-[.18em]">The campus feed</p></div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Posts</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Share what you're working on, ask your campus a question, or post a thought. Keep it kind and useful.</p>
        </header>
        <PostsFeed currentUserId={session.user.id} />
      </div>
    </main>
  );
}
