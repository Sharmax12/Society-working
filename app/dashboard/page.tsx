import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Users,
  UserRound,
  MessageSquareText,
  Sparkles,
  MoveUpRight,
} from "lucide-react";

import {
  getOpenSocieties,
  getUserApplications,
} from "@/modules/societies/queries";

import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/modules/auth/components/sign-out";

const navigation = [
  {
    label: "Profile",
    description: "Your campus identity",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "Connect",
    description: "Join conversations",
    href: "/connect",
    icon: MessageSquareText,
  },
  {
    label: "Posts",
    description: "Share your thoughts",
    href: "/posts",
    icon: MessageSquareText,
  },
  {
    label: "Societies",
    description: "Find your community",
    href: "/societies",
    icon: Compass,
  },
  {
    label: "Events",
    description: "Explore campus life",
    href: "/events",
    icon: CalendarDays,
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const [societies, applications] = await Promise.all([
    getOpenSocieties(),
    getUserApplications(session.user.id),
  ]);

  const appliedSocietyIds = new Set(
    applications.map((application) => application.societyId)
  );

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#30221C] antialiased selection:bg-[#DCC9B5] selection:text-[#30221C]">

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">

        {/* Header */}
        <header className="flex flex-col justify-between gap-7 border-b border-[#E9DED2] pb-9 sm:flex-row sm:items-center sm:pb-11">

          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#927D70]">
              <span>Dashboard</span>
              <span className="text-[#C7B5A6]">/</span>
              <span>{firstName}</span>
            </div>

            <h1 className="font-serif text-3xl font-medium tracking-[-0.045em] sm:text-4xl lg:text-[42px]">
              Welcome back, {firstName}.
            </h1>

            <p className="max-w-lg text-sm leading-6 text-[#806E62]">
              Your campus, your people, your next opportunity.
            </p>
          </div>

          <div className="flex items-center justify-between gap-5 sm:justify-end">

            <div className="rounded-xl border border-[#E9DED2] bg-[#FFFCF8] px-5 py-3.5 transition-colors duration-300 hover:border-[#D8C5B5]">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#927D70]">
                Applications
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl font-medium tracking-tight">
                  {applications.length}
                </span>
                <span className="text-xs text-[#806E62]">
                  submitted
                </span>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-[#E9DED2] sm:block" />

            <SignOutButton />
          </div>
        </header>

        {/* Quick navigation */}
        <nav
          aria-label="Dashboard navigation"
          className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:py-8"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E9DED2] bg-[#FFFCF8] p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#CFB8A5] hover:bg-white hover:shadow-[0_8px_24px_rgba(76,51,35,0.045)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78A73] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EF]"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4EDE4] transition-colors duration-300 group-hover:bg-[#EDE0D2]">
                    <Icon className="h-[17px] w-[17px] text-[#806B5E]" strokeWidth={1.6} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#927D70]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-[#A28C7D] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#30221C]" strokeWidth={1.5} />
              </Link>
            );
          })}
        </nav>

        {/* Open societies */}
        <section className="mt-5 sm:mt-7">

          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#9A806B]" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#927D70]">
                  Find your people
                </span>
              </div>

              <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
                Open Societies
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#806E62] sm:text-sm">
                Communities currently welcoming new members.
              </p>
            </div>

            <Link
              href="/societies"
              className="group flex shrink-0 items-center gap-1.5 pb-1 text-xs text-[#806E62] transition-colors hover:text-[#30221C]"
            >
              Explore all
              <MoveUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {societies.length === 0 ? (
            <div className="group rounded-2xl border border-dashed border-[#E4D6C9] bg-[#FDF9F3] px-5 py-12 text-center transition-colors duration-300 hover:border-[#D3BCA9] sm:py-16">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E9DED2] bg-[#FFFCF8]">
                <Users className="h-5 w-5 text-[#A58E7C]" strokeWidth={1.5} />
              </div>

              <h3 className="mt-5 font-serif text-lg font-medium">
                Your next community is out there.
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#806E62] sm:text-sm">
                There are no active application openings right now.
                Explore societies and check back when recruitment begins.
              </p>

              <Link
                href="/societies"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#DFCEBF] bg-[#FFFCF8] px-4 py-2.5 text-xs font-medium transition-all duration-300 hover:border-[#BDA28D] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78A73]"
              >
                Explore societies
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {societies.slice(0, 6).map((society) => (
                <article
                  key={society.id}
                  className="group flex flex-col justify-between rounded-2xl border border-[#E9DED2] bg-[#FFFCF8] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CFB8A5] hover:shadow-[0_8px_24px_rgba(76,51,35,0.045)] sm:p-6"
                >
                  <div>
                    <div className="flex min-h-6 items-center justify-between gap-2">
                      {society.category ? (
                        <Badge
                          variant="outline"
                          className="rounded-md border-[#E7D9CC] bg-[#F8F1E8] px-2 py-1 font-mono text-[9px] font-normal uppercase tracking-wider text-[#806B5E]"
                        >
                          {society.category}
                        </Badge>
                      ) : (
                        <span />
                      )}

                      <ArrowRight className="h-4 w-4 text-[#B6A292] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#30221C]" />
                    </div>

                    <h3 className="mt-4 font-serif text-xl font-medium tracking-tight">
                      {society.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#806E62]">
                      {society.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#EEE4DA] pt-4 text-xs">
                    {appliedSocietyIds.has(society.id) ? (
                      <StatusBadge
                        status={
                          applications.find(
                            (application) =>
                              application.societyId === society.id
                          )?.status ?? "PENDING"
                        }
                      />
                    ) : (
                      <Link
                        href={`/apply/${society.id}`}
                        className="font-medium underline-offset-4 transition-colors hover:text-[#8A6A53] hover:underline"
                      >
                        Apply now <span aria-hidden="true">→</span>
                      </Link>
                    )}

                    <Link
                      href={`/societies/${society.id}`}
                      className="text-[#927D70] transition-colors hover:text-[#30221C]"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Application activity */}
        <section className="mt-12 border-t border-[#E9DED2] pt-9 sm:mt-16 sm:pt-11">

          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#927D70]">
                Your journey
              </p>

              <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
                Your Applications
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#806E62] sm:text-sm">
                Keep track of the communities you have reached out to.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-[#E9DED2] bg-[#FFFCF8] px-3 py-1.5 font-mono text-[10px] text-[#806E62]">
              {applications.length} total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E4D6C9] bg-[#FDF9F3] px-5 py-10 text-center sm:py-12">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9DED2] bg-[#FFFCF8]">
                <Compass className="h-[18px] w-[18px] text-[#A58E7C]" strokeWidth={1.5} />
              </div>

              <h3 className="mt-4 font-serif text-lg font-medium">
                Every journey starts somewhere.
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#806E62] sm:text-sm">
                You have not submitted any applications yet.
              </p>

              <Link
                href="/societies"
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-[#8A6A53]"
              >
                Find a society to join
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-[#FFFCF8]">
              {applications.map((application, index) => (
                <div
                  key={application.id}
                  className={`flex items-center justify-between gap-4 p-4 transition-colors hover:bg-[#FDF8F2] sm:p-5 ${
                    index !== applications.length - 1
                      ? "border-b border-[#EEE4DA]"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E9DED2] bg-[#F8F1E8]">
                      <UserRound
                        className="h-4 w-4 text-[#806B5E]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {application.society.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#927D70]">
                        Submitted{" "}
                        {new Date(
                          application.submittedAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-14 flex flex-col gap-3 border-t border-[#E9DED2] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-sm text-[#806E62]">
            HallwayLoop<span className="text-[#B59B84]">.</span>
          </p>

          <p className="text-[10px] tracking-wide text-[#A08B7D]">
            Discover. Belong. Connect.
          </p>
        </footer>

      </div>
    </main>
  );
}