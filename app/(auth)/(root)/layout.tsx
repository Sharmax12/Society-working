import { cn } from "@/lib/utils";
import {Footer} from "@/modules/home/footer";
import { Header } from "@/modules/home/header";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

const { title: SITE_TITLE, description: SITE_DESCRIPTION } = siteConfig.marketing;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [...siteConfig.keywords],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 512, height: 512 }],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [siteConfig.ogImage],
  },
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div
        className={cn(
        "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "absolute inset-0 -z-10",
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <main className="z-20 relative w-full pt-0">{children}</main>
      <Footer />
    </div>
  );
}
