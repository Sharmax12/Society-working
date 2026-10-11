import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Connect Updates",
  description: "Get HallWayLoop launch updates and hear when new campus discovery features are ready.",
  alternates: { canonical: `${siteConfig.url}/connect-launch` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Connect Updates | HallWayLoop",
    description: "Get HallWayLoop launch updates and hear when new campus discovery features are ready.",
    url: `${siteConfig.url}/connect-launch`,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop launch updates" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect Updates | HallWayLoop",
    description: "Get HallWayLoop launch updates and hear when new campus discovery features are ready.",
    images: [siteConfig.ogImage],
  },
};

export default function ConnectLaunchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
