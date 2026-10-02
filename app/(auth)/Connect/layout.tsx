import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect",
  description: "Connect with students, collaborators, and campus communities on HallWayLoop.",
  keywords: ["student networking", "connect with students", "campus community", "college networking"],
  alternates: { canonical: "/Connect" },
  openGraph: {
    title: "Connect | HallWayLoop",
    description: "Connect with students, collaborators, and campus communities on HallWayLoop.",
    url: "/Connect",
    siteName: "HallWayLoop",
    type: "website",
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
