import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MessageCircle, Sparkles, Users } from "lucide-react";
import { auth } from "@/auth";
import { getExistingApplication, getSocietyWithQuestions } from "@/modules/societies/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ id: string }>;
};

// Per-society metadata: each society gets its own indexable title and
// description built from real content, instead of every page sharing one
// generic title.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const society = await getSocietyWithQuestions(id);

  if (!society) {
    return { title: "Society not found" };
  }

  const description = society.description.slice(0, 155);

  return {
    title: society.name,
    description,
    alternates: { canonical: `/societies/${society.id}` },
    openGraph: {
      title: `${society.name} | HallWayLoop`,
      description,
      url: `/societies/${society.id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${society.name} | HallWayLoop`,
      description,
    },
  };
}

export default async function SocietyDetailPage({ params }: Props) {
  const { id } = await params; const society = await getSocietyWithQuestions(id); if (!society) notFound();
  const session = await auth(); const alreadyApplied = session?.user?.id ? Boolean(await getExistingApplication(session.user.id, society.id)) : false;
  const deadline = new Date(society.deadline);
  return <main className="min-h-screen bg-background"><section className="border-b bg-gradient-to-br from-rose-500/[.1] via-background to-orange-500/[.05]"><div className="mx-auto max-w-6xl px-6 pb-14 pt-10"><Link href="/societies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4"/> All societies</Link><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end"><div><div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-rose-500"><Sparkles className="h-4 w-4"/> Society profile</div>{society.category && <Badge variant="secondary" className="mb-4 capitalize">{society.category}</Badge>}<h1 className="text-4xl font-black tracking-[-.04em] sm:text-6xl">{society.name}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{society.description}</p></div><div className="rounded-3xl border bg-background/70 p-6 shadow-sm backdrop-blur"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500"><Users className="h-5 w-5"/></div><div><p className="font-bold">Join the community</p><p className="text-xs text-muted-foreground">Connect with people who share your interests.</p></div></div><div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4"/> Applications close {deadline.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div><div className="mt-6">{alreadyApplied ? <Button disabled className="w-full">Application submitted</Button> : society.isOpen ? <Link href={`/apply/${society.id}`}><Button variant="brand" size="lg" className="w-full">Apply to join <ArrowUpRight className="h-4 w-4"/></Button></Link> : <Button disabled variant="outline" className="w-full">Applications closed</Button>}</div></div></div></div></section><div className="mx-auto max-w-6xl px-6 py-12"><div className="grid gap-5 md:grid-cols-2"><div className="rounded-3xl border bg-card p-7"><MessageCircle className="mb-6 h-5 w-5 text-violet-500"/><h2 className="text-xl font-bold">Community conversations</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Society chat is coming soon — a dedicated space for members to share ideas, coordinate and stay connected.</p><Badge variant="secondary" className="mt-5">Coming soon</Badge></div><div className="rounded-3xl border bg-card p-7"><Users className="mb-6 h-5 w-5 text-rose-500"/><h2 className="text-xl font-bold">A place to belong</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Discover what this society is about, understand the application process and take your first step into campus life.</p></div></div></div></main>;
}
