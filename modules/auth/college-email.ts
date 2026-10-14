/**
 * Enforce a server-side college email allowlist.
 *
 * Configure COLLEGE_EMAIL_DOMAINS as a comma-separated list such as
 * "university.edu,example.ac.in". An empty allowlist fails closed.
 */
export function isAllowedCollegeEmail(email: string): boolean {
  const allowedDomains = (process.env.COLLEGE_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
  const domain = email.trim().toLowerCase().split("@").at(-1);
  return allowedDomains.length > 0 && !!domain && allowedDomains.includes(domain);
}
