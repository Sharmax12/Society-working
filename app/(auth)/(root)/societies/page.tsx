import type { Metadata } from "next";
import { getOpenSocieties } from "@/modules/societies/queries";
import { SocietyDirectory } from "./society-directory";

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
