import { cn } from "@/lib/utils";
import { Footer } from "@/modules/home/footer";
import { Header } from "@/modules/home/header";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

const { title: SITE_TITLE, description: SITE_DESCRIPTION } = siteConfig.marketing;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), title: SITE_TITLE, description: SITE_DESCRIPTION, keywords: [...siteConfig.keywords], alternates: { canonical: "/" }, robots: { index: true, follow: true }, openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, url: "/", siteName: siteConfig.name, images: [{ url: siteConfig.ogImage, width: 512, height: 512 }], locale: siteConfig.locale, type: "website" }, twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [siteConfig.ogImage] },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <div className={cn("pointer-events-none fixed inset-0 -z-10 [background-size:48px_48px] [background-image:linear-gradient(to_right,rgba(120,113,108,.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,.07)_1px,transparent_1px)]", "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.045)_1px,transparent_1px)]")} />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/.09),transparent_35%)]" />
      <main className="relative z-10 w-full">{children}</main>
      <Footer />
    </div>
  );
}
