import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

const description =
  "Read how HallWayLoop handles account, profile, society-application, and launch-notification information.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | HallWayLoop",
    description,
    url: "/privacy",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "HallWayLoop Privacy Policy" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | HallWayLoop",
    description,
    images: [siteConfig.ogImage],
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Policies</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Draft updated 11 October 2026 · Contact: {siteConfig.contactEmail}</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground sm:text-base">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. About this policy</h2>
          <p className="mt-2">HallWayLoop (“HWL”, “we”, “us”) is developing a platform for college communities, society profiles, and campus events. This page explains the information the website may collect and how it is used. The service and this policy are still being developed, so the final wording must be checked against the deployed product and its vendors before launch.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Information we collect</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li><strong className="text-foreground">Account details:</strong> email address, name, profile image, and authentication details needed to create and maintain an account. Google sign-in may provide your Google email, name, and profile image.</li>
            <li><strong className="text-foreground">Society applications:</strong> information you enter when applying to a society, including responses to its application questions and relevant contact details.</li>
            <li><strong className="text-foreground">Launch notifications:</strong> email addresses submitted through a notification or updates form.</li>
            <li><strong className="text-foreground">Technical information:</strong> ordinary request and diagnostic information processed by our hosting and infrastructure providers to operate and protect the website.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Why we use information</h2>
          <p className="mt-2">We use information to authenticate users, display profiles, process society applications, send requested launch updates, maintain the service, prevent misuse, troubleshoot faults, and meet applicable legal obligations. We do not need Google access or refresh tokens for sign-in and are configuring the application not to persist those tokens.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Service providers and sharing</h2>
          <p className="mt-2">Information may be processed by service providers that support hosting, database storage, authentication, and email delivery. We do not sell personal information. We may disclose information where required by law or when reasonably necessary to protect users, the service, or legal rights. The final list of service providers and their roles should be confirmed before launch.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Retention and security</h2>
          <p className="mt-2">We retain information for as long as needed to operate the relevant feature, handle applications, maintain account security, resolve disputes, or comply with legal obligations. Retention periods and deletion controls should be documented and tested before the full product launch. We use technical and organisational safeguards, but no online system can be guaranteed completely secure.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Your choices and requests</h2>
          <p className="mt-2">You may contact us to request access to, correction of, or deletion of information associated with you, or to ask about a notification subscription. We will assess and respond to requests under applicable law. Contact {siteConfig.contactEmail} from the email address associated with your account and describe the request without sending passwords or authentication secrets.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Students under 18</h2>
          <p className="mt-2">The service is designed for college communities, but some users may be under 18. Age-appropriate safeguards, any required parental-consent process, and related handling must be reviewed and implemented before knowingly onboarding children where the law requires it. Please contact us with questions about a minor’s information.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Changes and contact</h2>
          <p className="mt-2">We may update this policy as the website changes. Material updates should be reflected here with a revised date. For privacy questions, email {siteConfig.contactEmail}.</p>
        </section>
      </div>
      <p className="mt-10 rounded-2xl border border-border p-4 text-xs leading-5 text-muted-foreground">Important: this is a working draft, not a representation of legal compliance. Have Indian privacy counsel review it against the actual data flows, processors, age policy, and applicable DPDP requirements before production use.</p>
    </main>
  );
}
