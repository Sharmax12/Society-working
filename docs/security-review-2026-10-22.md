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
| High | A person blocked by another user could delete the connection row and effectively undo the block. | Added nullable `Connection.blockedById`, a Prisma relation/migration, and authorization that lets only the blocker remove a newly blocked edge. Legacy blocked edges with no blocker ID remain removable by either participant. |
| Medium | Application submission updated the user's phone/roll number before validating all answers, leaving partial profile changes when validation failed. | Validate first, bound fields, and atomically write the profile update plus application/answers in a transaction. Application status arguments are also validated at runtime. |
| Medium | JSON APIs parsed unbounded bodies before checking field lengths. | Added a streaming byte-limited JSON reader and applied size limits to campus leads, profile, posts, connection, conversation, and message APIs. Oversized requests return HTTP 413. |
| Medium | Profile-photo input accepted HTTP URLs and did not enforce all string limits consistently. | Require HTTPS and valid URL structure; validate name/college/bio/image lengths and reject malformed JSON. |
| Medium | Chat history returned the oldest 100 messages, hiding later messages in long conversations. | Fetch the latest 100 and restore chronological display order. |
| Medium | API responses lacked a repository-wide explicit no-store response policy. | Added `private, no-store` cache headers for API routes and added per-response no-store handling to profile/posts endpoints. |
| Low | Some JSON-LD script payloads were serialized with plain `JSON.stringify`. | Standardized escaping of `<` through `jsonLdString` on the home page. |
| Process | There was no CI workflow or automated dependency-update configuration. | Added CI for install, Prisma migrations, lint, TypeScript, production build, and high/critical dependency audit; added weekly Dependabot updates. |

## Residual risks — address before production launch

### High: email address ownership is not verified for password registration

The current local registration action creates a login-enabled user after validating the shape/domain of an email address; it does not prove the registrant controls that mailbox. Someone may register another student's address and create a password for that account. This can enable impersonation, and verified Google sign-in can potentially link to an existing user with that email. This was **not** changed in this patch because a safe fix requires an account-verification and recovery flow, including a rollout policy for existing accounts. Add mailbox verification before enabling credentials sign-in and carefully disable unsafe automatic linking to unverified credential accounts. Also add a secure password-reset flow.

### High: no shared distributed rate limiting

The public campus-lead endpoint can send email, and sign-in, registration, connection requests, and chat/post writes have no shared, deployment-safe rate limit. Request-body caps help with oversized payloads but do not prevent repeated valid requests. Add a shared limiter (for example, a managed Redis/KV or a database-backed limiter with cleanup and atomic limits), especially for credentials login and email-triggering endpoints. An in-memory map is not sufficient across serverless instances.

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

1. Run the new CI workflow and resolve every failing check.
2. Add email ownership verification and password reset before enabling email/password login for a public launch.
3. Add shared rate limits and telemetry to auth, campus-lead email, connections, and messaging endpoints.
4. Validate CSP in the deployed app, then enforce a stricter policy.
5. Confirm the new `Connection.blockedById` migration is applied before deploying code that writes/reads it.
6. Enable repository security settings and complete the production configuration/secret-history review.

**Overall assessment:** this branch closes multiple high-impact authorization and data-exposure flaws, but the app should not be described as fully security-hardened or production-ready until the high residual risks above are addressed and CI/deployment checks pass.
