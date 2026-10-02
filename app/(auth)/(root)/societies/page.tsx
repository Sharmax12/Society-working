import type { Metadata } from "next";
import { getSocietiesForDirectory } from "@/modules/societies/queries";
import { SocietyDirectory } from "./society-directory";

export const metadata: Metadata = {
  title: "College Societies & Clubs",
  description: "Explore verified college societies, student clubs, and campus communities on HallWayLoop.",
  keywords: ["college societies", "college clubs", "student clubs", "university societies", "student communities"],
  alternates: { canonical: "/societies" },
  openGraph: {
    title: "College Societies & Clubs | HallWayLoop",
    description: "Explore verified college societies, student clubs, and campus communities.",
    url: "/societies",
    siteName: "HallWayLoop",
    type: "website",
  },
};
export const revalidate = 60;

export default async function SocietiesPage() {
  const societies = await getSocietiesForDirectory();
  return (
    <main className="min-h-screen bg-background">
      <SocietyDirectory societies={societies} />
    </main>
  );
}
