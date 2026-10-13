import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { ProfileEditor } from "@/modules/profile/profile-editor";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      college: true,
      bio: true,
      profilePhoto: true,
      image: true,
    },
  });
  if (!user) redirect("/auth/sign-in");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-muted">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <header className="mt-7 mb-6">
          <div className="flex items-center gap-3 text-primary"><UserRound className="h-5 w-5" /><p className="text-xs font-black uppercase tracking-[.18em]">Your campus identity</p></div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Profile</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Introduce yourself to your campus community. Your name, college, bio, and photo help other students recognise you.</p>
        </header>
        <ProfileEditor initialProfile={user} />
      </div>
    </main>
  );
}
