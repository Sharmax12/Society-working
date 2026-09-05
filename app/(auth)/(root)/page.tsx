import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hallwayloop.app";

// Organization/WebSite structured data helps Google understand the entity
// behind the site and can unlock a sitelinks search box in results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HallWayLoop",
  url: SITE_URL,
  description:
    "Discover, apply, and manage college society applications in one place.",
};

export default function Home() {

  return (
    <div className=" z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col justify-center items-center my-5">
      <Image
        src={"/hero.svg"}
        alt="Students collaborating and discovering clubs on HallWayLoop"
        height={500}
        width={500}
        priority
      />

      <h1 className=" z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight leading-[1.3] ">
        Your campus. Your people. Your conversations.
      </h1>
      </div>
     

      <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400 px-5 py-10 max-w-2xl">
        One platform to discover clubs, apply in seconds, and run your society without the chaos of spreadsheets and DMs. Built for students who lead, and the ones ready to join them.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <Link href={"/dashboard"}>
          <Button variant={"brand"} size={"lg"}>
            Get Started
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Link href={"/societies"}>
          <Button variant={"outline"} size={"lg"}>
            Browse Societies
          </Button>
        </Link>
      </div>
    </div>
  );
}
