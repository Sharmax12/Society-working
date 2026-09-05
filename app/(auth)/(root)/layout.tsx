import { cn } from "@/lib/utils";
import {Footer} from "@/modules/home/footer";
import { Header } from "@/modules/home/header";
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app";
const SITE_TITLE = "HallWayLoop — Where Campus Societies Come Alive";
const SITE_DESCRIPTION =
  "Discover, apply, and manage college society applications in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "campus societies",
    "college clubs",
    "student organizations",
    "club applications",
    "society management",
    "join a college club",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "HallWayLoop",
    images: [{ url: "/logo.svg", width: 512, height: 512 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.svg"],
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
          "absolute inset-0 -z-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <main className="z-20 relative w-full pt-0">{children}</main>
      <Footer />
    </div>
  );
}
