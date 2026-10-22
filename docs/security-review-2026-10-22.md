# HallwayLoop security review — 22 October 2026

## Scope and method

Reviewed the live GitHub snapshot of `main` at `813a78fcf4a4a9a7115f5fbf065f70eaba3c4bdd`, inventoried the repository tree, and performed a focused static review of security-sensitive API handlers, server actions, authentication, role/ownership checks, Prisma schema/migrations, dependency configuration, and selected pages. This was a fresh repository review, not a review based on chat summaries. It is **not yet an exhaustive line-by-line review of every UI component and source file**.

This is a code-level assessment, not a penetration test. No production database, deployment environment, DNS, provider console, secret-history scanner, or authenticated live deployment was available. A CI run at commit `8bc24745fcd5232f9f5b707975287d66247c2905` passed install, migrations, lint, type-check, and production build, but failed the full dependency audit due to high-severity development-toolchain advisories. Follow-up dependency classification and CI audit-gate changes are being validated; do not merge until the latest run is green.

## Changes made on `security/hwl-audit-hardening`

| Severity | Finding | Change |
|---|---|---|
| High | A server-action helper returned full user rows and related OAuth accounts without checking identity. That could expose password hashes and provider tokens to a caller. | `getUserById` and `getAccountByUserId` now require the signed-in user's own ID and return explicit safe-field allowlists. |
| High | Society application review used `student: true`, returning all User scalar columns—including `passwordHash`—to the review UI. | Replaced with an explicit applicant-field allowlist. |
| High | Exported server-action query functions trusted caller-provided student/admin IDs and an `isGlobalAdmin` boolean. | Application query actions check the current session; event-admin queries derive scope and role from the authenticated session. |
| High | Middleware treated a truthy Auth.js request object as proof of login. | Login guard now requires `req.auth.user`; auth/public prefixes use path-boundary checks. |
| High | A person blocked by another user could delete the connection row and effectively undo the block. | Added nullable `Connection.blockedById`, a Prisma relation/migration, and authorization that lets only the blocker remove a newly blocked edge. Legacy blocked edges with unknown blocker ownership cannot be removed by either participant until support/admin review; this preserves the block rather than allowing accidental unblocking. |
| High | Password registration did not prove mailbox ownership and had no recovery flow. | Added single-use, hashed email-verification/password-reset tokens, token expiry/replay checks, credential sign-in verification, generic resend/reset responses, and auth-version session revocation after password reset. |
| Medium-high | Valid repeated requests could exhaust email, chat, or mutation resources despite body-size limits. | Added an atomic PostgreSQL fixed-window rate limiter with HMACed bucket identifiers across authentication, token actions, campus-lead emails, applications, relationship/chat reads and writes, event mutations, society creation, and posts. |
| Medium | Directional connection uniqueness allowed A→B and B→A duplicate relationship rows under concurrency. | Added a canonical unique pair key, a data-consolidating migration, and HTTP 409 handling for concurrent duplicate requests. |
| Medium | Chat details, history and last-message previews remained visible after the underlying connection was blocked. | Direct conversation details, messages and read receipts now require an accepted connection; the conversation list filters out inactive relationships. Authenticated list endpoints are rate-limited and response sizes are bounded. |
| Medium | Application submission updated the user's phone/roll number before validating all answers, leaving partial profile changes when validation failed. | Validate first, bound fields, and atomically write the profile update plus application/answers in a transaction. Application status arguments are also validated at runtime. |
| Medium | JSON APIs parsed unbounded bodies before checking field lengths. | Added a streaming byte-limited JSON reader and applied size limits to campus leads, profile, posts, connection, conversation, and message APIs. Oversized requests return HTTP 413. |
| Medium | Profile-photo input accepted HTTP URLs and did not enforce all string limits consistently. | Require HTTPS and valid URL structure; validate name/college/bio/image lengths and reject malformed JSON. |
| Medium | Chat history returned the oldest 100 messages, hiding later messages in long conversations. | Fetch the latest 100 and restore chronological display order. |
| Medium | API responses lacked a repository-wide explicit no-store response policy. | Added `private, no-store` cache headers for API routes and added per-response no-store handling to profile/posts endpoints. |
| Low | Some JSON-LD script payloads were serialized with plain `JSON.stringify`. | Standardized escaping of `<` through `jsonLdString` on the home page. |
| Process | There was no CI workflow or automated dependency-update configuration. | Added CI for install, Prisma migrations, lint, TypeScript, production build, and high/critical dependency audit; added weekly Dependabot updates. |

## Residual risks — address before production launch

### High: email verification and password recovery are implemented but require end-to-end verification

Local password accounts are created with `emailVerified = null`; Credentials sign-in rejects those users until a valid single-use, 30-minute verification token is submitted. Tokens are stored only as SHA-256 hashes in the database. Resending verification and password reset use generic responses to reduce account enumeration and database-backed rate limits to restrict repeated attempts. Resetting a password consumes a single-use token, changes the password hash, increments `authVersion`, and invalidates existing JWT sessions on their next request. Google sign-in requires Google's verified-email claim, an exact match to the returned email, and the configured college-domain allowlist; it will not silently attach to an unverified password account.

**Still required before launch:** complete the latest CI run; test actual mail delivery and token expiry/single-use behavior; configure `NEXT_PUBLIC_APP_URL` to the exact production origin; and decide how existing password users with `emailVerified = null` will re-verify. A database migration intentionally does not mark legacy password accounts as verified.

### Medium-high: shared rate limiting is implemented and needs production tuning

A PostgreSQL-backed atomic fixed-window limiter is wired into local sign-in/registration, verification resend, password-reset requests, campus-lead email, applications, posts, connection mutations, messaging, event creation/deletion, and society creation. Identifiers are HMAC-protected, so raw email addresses and IPs are not stored in the bucket table. Thresholds need to be tuned against actual pilot traffic, and alerting/telemetry plus testing of trusted forwarded-IP headers are still required. The `RateLimitBucket` migration must be applied before deploying these code paths.

### High: Content Security Policy remains report-only

The current CSP is intentionally `Content-Security-Policy-Report-Only` and permits broad `https:` sources, inline scripts, and `unsafe-eval`. Keep it report-only until reports and browser checks identify required sources, then tighten it (ideally nonce-based scripts) and enforce it gradually. This patch does not claim CSP enforcement.

### Medium: dependency audit — runtime gate improved, development-tool findings unresolved

The dependency audit at commit `8bc24745fcd5232f9f5b707975287d66247c2905` reported 12 high-severity findings, with the printed root causes including `braces` (GHSA-vfj7-8cjw-p6xm) through glob/micromatch tooling and `deepmerge-ts` (GHSA-ggr8-5vv4-36mx) through the Prisma CLI. The remediation path proposed by npm included breaking major-version changes, so `npm audit fix --force` was not applied. The CLI-only `shadcn` package has been moved from production dependencies to development dependencies, the manifest/lockfile root dependency categories were aligned, and CI now retains the full audit JSON as an artifact while gating production dependencies with `npm audit --omit=dev --audit-level=high`.

This does **not** mean the full dependency tree is vulnerability-free. Review the full audit artifact, confirm that the root advisory paths are reachable only in development/build tooling, and time-box the unresolved advisories with owners/revisit dates. Do not downgrade the severity of these findings or claim a fully clean audit. Next.js is pinned to 16.4.2 in the reviewed branch; `next-auth` remains 5.0.0-beta.32.

Relevant advisories:
- Auth.js truthy-auth-object fail-open issue (affected through beta.31; fixed in beta.32): https://github.com/nextauthjs/next-auth/security/advisories/GHSA-8fpg-xm3f-6cx3
- Next.js RSC advisory (check the affected range/fixed version against the lockfile): https://github.com/advisories/GHSA-2xp9-vwfh-vxw4
- npm's dependency audit procedure: https://docs.npmjs.com/cli/commands/npm-audit/

### Medium: deployment and repository settings are external to this code patch

Enable GitHub secret scanning/push protection, Dependabot alerts, and branch protection requiring CI and review. Scan **all Git history** with a secret scanner and rotate any credential ever committed; ignoring `.env` files does not remove historical secrets. Verify production database TLS, least-privilege credentials, backups and restores, OAuth redirect URIs, Resend sender-domain setup, and account-level/registrar MFA. Existing OAuth token rows must be assessed and cleared if no longer needed; this repository cannot safely mutate the production database.

### Medium: broader abuse/privacy controls need a product policy

Decide how students report/block abusive accounts, how account deletion/export is handled, how long messages/application answers are retained, and which profile fields are visible before a connection is accepted. The connection, request, and conversation API projections now omit roll numbers; the authenticated user's own profile and authorized society application review may still expose them. Review this against the intended campus-identity policy.

## Recommended release gate

1. Confirm the latest CI run on the final PR head is green (migration deploy, lint, type-check, production build, and production dependency audit); inspect the retained full audit artifact.
2. Configure `NEXT_PUBLIC_APP_URL`, `AUTH_SECRET`, `RATE_LIMIT_SECRET` (optional but recommended), approved college domains, Google OAuth callback URLs, and a verified Resend sending domain; test actual delivery to allowed and disallowed accounts.
3. Review a production-data copy before applying the `Connection.blockedById`, canonical `Connection.pairKey`, `RateLimitBucket`, and `AuthToken` migrations. The pair-key migration consolidates legacy duplicates; confirm the intended retained relationship for any conflicting pair.
4. Test registration/verification/resend/password-reset flows, token expiry and replay, rate-limit failures, sign-in with unverified accounts, Google account linking, and password-reset session revocation.
5. Validate CSP in the deployed app, then enforce a stricter policy after browser testing.
6. Enable repository secret scanning/push protection, Dependabot alerts, and branch protection requiring CI/review. Scan full Git history and rotate any credential ever committed.
7. Verify production database TLS/least-privilege credentials, backups and restore, OAuth redirects, email DNS (SPF/DKIM/DMARC), account MFA, reporting/blocking abuse flows, and privacy/retention/export handling.
8. Do not deploy until the final CI result is green and these production-only checks are signed off.

**Overall assessment:** this branch closes multiple high-impact authorization and data-exposure flaws, but the app should not be described as fully security-hardened or production-ready until the high residual risks above are addressed and CI/deployment checks pass.
