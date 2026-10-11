import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

const description =
  "Review the terms for using HallWayLoop’s website, society directory, event listings, and account features.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | HallWayLoop",
    description,
    url: "/terms",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop Terms of Use" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | HallWayLoop",
    description,
    images: [siteConfig.ogImage],
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Policies</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Terms of Use</h1>
      <p className="mt-4 text-sm text-muted-foreground">Draft updated 11 October 2026 · Contact: {siteConfig.contactEmail}</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground sm:text-base">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. About HallWayLoop</h2>
          <p className="mt-2">HallWayLoop (“HWL”, “we”, “us”) is a product in development for campus communities. The website may provide society profiles, event listings, account features, society applications, and launch notifications. Features may change as the product develops.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Eligibility and accounts</h2>
          <p className="mt-2">Provide accurate information, keep account credentials confidential, and notify us promptly if you suspect unauthorised access. Some account features may be restricted to approved college email domains or eligible campus communities. Do not create accounts on behalf of another person without permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Acceptable use</h2>
          <p className="mt-2">Do not misuse the service, attempt to bypass access controls, probe or disrupt systems, upload malicious content, impersonate others, violate privacy, harass users, or submit unlawful or misleading material. We may investigate suspected misuse and restrict access where reasonably necessary to protect the community or service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Societies, applications, and events</h2>
          <p className="mt-2">Society and event information may be supplied by organisers and can become outdated or inaccurate. Verify important details with the organiser before travelling, paying, or relying on an event. HallWayLoop does not guarantee admission, event delivery, selection in a society, or the accuracy of third-party submissions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Intellectual property and submissions</h2>
          <p className="mt-2">You retain rights you hold in content you submit. You give HallWayLoop permission to host, process, and display that content as needed to operate the feature you chose, subject to your settings and applicable law. Do not upload content you do not have the right to share. HallWayLoop’s name, branding, and original site materials may not be reused to imply endorsement without permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Availability and third-party services</h2>
          <p className="mt-2">The service is provided as available while it is developed. We may change, suspend, or remove features for maintenance, safety, or product reasons. Sign-in, hosting, storage, and email delivery may rely on third-party services that have their own terms and availability.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Liability and legal compliance</h2>
          <p className="mt-2">Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded. To the extent allowed by applicable law, HallWayLoop is not responsible for indirect losses arising from temporary unavailability, user-submitted listings, or third-party events. These terms should be reviewed by Indian counsel and tailored to the operating entity, dispute process, and applicable consumer and data-protection laws before production use.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Contact and updates</h2>
          <p className="mt-2">We may revise these terms as the product changes. The current version will be published on this page. Questions can be sent to {siteConfig.contactEmail}.</p>
        </section>
      </div>
      <p className="mt-10 rounded-2xl border border-border p-4 text-xs leading-5 text-muted-foreground">Important: this is a working draft for implementation and is not a substitute for legal advice. Have counsel review it before production use.</p>
    </main>
  );
}
