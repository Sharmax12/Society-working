import type { Metadata } from "next";
import { getSocietiesForDirectory } from "@/modules/societies/queries";
import { SocietyDirectory } from "./society-directory";
import { siteConfig, buildOrganizationJsonLd } from "@/lib/seo";

const societiesDescription =
  "Explore college societies, student clubs, and campus communities on HallWayLoop.";

export const metadata: Metadata = {
  title: "College Societies & Clubs",
  description: societiesDescription,
  keywords: ["college societies", "college clubs", "student clubs", "university societies", "student communities"],
  alternates: { canonical: "/societies" },
  openGraph: {
    title: "College Societies & Clubs | HallWayLoop",
    description: societiesDescription,
    url: "/societies",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Explore college societies on HallWayLoop" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Societies & Clubs | HallWayLoop",
    description: societiesDescription,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
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
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <SocietyDirectory societies={societies} />
    </main>
  );
}
