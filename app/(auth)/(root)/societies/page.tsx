import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getOpenSocieties } from "@/modules/societies/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Browse Societies",
  description:
    "Explore open college societies and clubs on CampusCircle — find your community and apply in seconds.",
  alternates: { canonical: "/societies" },
  openGraph: {
    title: "Browse Societies | CampusCircle",
    description:
      "Explore open college societies and clubs on CampusCircle — find your community and apply in seconds.",
    url: "/societies",
  },
};

// Revalidate periodically so newly created/opened societies show up without
// needing a full redeploy, while still being served as static-ish content
// for crawlers.
export const revalidate = 3600;

export default async function SocietiesPage() {
  const societies = await getOpenSocieties();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Open Societies
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Browse clubs and societies currently accepting applications. Pick
          one to see details, deadlines, and what they&apos;re looking for.
        </p>
      </div>

      {societies.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No societies are open for applications right now — check back
          soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {societies.map((society) => (
            <Link key={society.id} href={`/societies/${society.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{society.name}</CardTitle>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                  </div>
                  {society.category && (
                    <Badge variant="secondary" className="w-fit mt-1">
                      {society.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {society.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Applications close{" "}
                    {new Date(society.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
