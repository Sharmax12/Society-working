import { siteConfig, geoFaqs } from "@/lib/seo";

export const dynamic = "force-static";

const content = `# HallWayLoop

> HallWayLoop (HWL) is a campus community platform for discovering college societies, student clubs, campus events, student communities, and people to learn, build, and connect with.

## Canonical website

${siteConfig.url}

## What HallWayLoop does

- Helps students discover college societies and student clubs.
- Helps users discover campus events and activities.
- Provides HallWayLoop Connect for finding people with shared interests, skills, projects, and hobbies.
- Helps campus communities make their activities and opportunities easier to discover.
- Is developing AI-powered conversational functionality for more natural discovery and navigation.

## Core concepts

- College societies
- Student clubs
- Campus events
- Student communities
- Campus networking
- Student collaboration
- Community discovery
- Student opportunities

## Frequently asked questions

${geoFaqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join("\n\n")}

## Important terminology

HallWayLoop and HWL refer to the same platform. HWL is the short name for HallWayLoop.

## Public resources

- Home: ${siteConfig.url}/
- Societies: ${siteConfig.url}/societies
- Events: ${siteConfig.url}/events
- Connect: ${siteConfig.url}/Connect
- FAQ: ${siteConfig.url}/faq

## Contact

${siteConfig.contactEmail}
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
