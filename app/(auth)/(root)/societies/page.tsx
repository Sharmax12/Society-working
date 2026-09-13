import type { Metadata } from "next";
import { getOpenSocieties } from "@/modules/societies/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Browse Societies",
  description:
    "Explore open college societies and clubs on HallWayLoop — find your community and apply in seconds.",
  alternates: { canonical: "/societies" },
  openGraph: {
    title: "Browse Societies | HallWayLoop",
    description:
      "Explore open college societies and clubs on HallWayLoop — find your community and apply in seconds.",
    url: "/societies",
  },
};

export const metadata: Metadata = { title: "Discover Societies", description: "Discover college societies, clubs and communities on HallWayLoop." };
export const revalidate = 3600;

export default async function SocietiesPage() {
  const societies = await getOpenSocieties();
  return (
    <main className="min-h-screen bg-background">
      <SocietyDirectory societies={societies} />
    </main>
  );
}
