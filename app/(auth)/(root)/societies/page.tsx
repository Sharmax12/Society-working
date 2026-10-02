import type { Metadata } from "next";
import { getSocietiesForDirectory } from "@/modules/societies/queries";
import { SocietyDirectory } from "./society-directory";
import { siteConfig } from "@/lib/seo";

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
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "College Societies & Clubs",
    itemListElement: societies.map((society, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: society.name,
      url: siteConfig.url + "/societies/" + society.id,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url + "/" },
      { "@type": "ListItem", position: 2, name: "Societies", item: siteConfig.url + "/societies" },
    ],
  };
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SocietyDirectory societies={societies} />
    </main>
  );
}
