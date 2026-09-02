import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { getSocietyWithQuestions } from "@/modules/societies/queries";
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
      title: `${society.name} | CampusCircle`,
      description,
      url: `/societies/${society.id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${society.name} | CampusCircle`,
      description,
    },
  };
}

export default async function SocietyDetailPage({ params }: Props) {
  const { id } = await params;
  const society = await getSocietyWithQuestions(id);

  if (!society) notFound();

  const deadline = new Date(society.deadline);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: society.name,
    description: society.description,
    ...(society.category ? { knowsAbout: society.category } : {}),
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {society.category && (
        <Badge variant="secondary" className="mb-3">
          {society.category}
        </Badge>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight">
        {society.name}
      </h1>

      <p className="text-muted-foreground mt-4 leading-relaxed">
        {society.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
        <CalendarDays className="w-4 h-4" />
        <span>
          Applications close{" "}
          {deadline.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-8">
        {society.isOpen ? (
          <Link href={`/apply/${society.id}`}>
            <Button variant="brand" size="lg">
              Apply Now
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="lg" disabled>
            Applications Closed
          </Button>
        )}
      </div>

      <Link
        href="/societies"
        className="inline-block mt-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to all societies
      </Link>
    </div>
  );
}
