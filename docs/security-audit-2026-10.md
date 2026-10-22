# HallwayLoop repository security review

**Review branch:** `security/audit-hardening-2026-10`  
**Review date:** 2026-10-22  
**Scope:** Freshly fetched authentication, profile, connection, conversation/message, post, Prisma schema, Next.js configuration, dependency manifest/lockfile, and auth/deployment guidance. This is a targeted static review, not a completed line-by-line audit of every file or a penetration test.

## Fixes made on this branch

1. **College-domain allowlist bypass during sign-in (high risk).** Registration enforced `COLLEGE_EMAIL_DOMAINS`, but the shared NextAuth sign-in callback did not. Added the same server-side allowlist check before accepting either credentials or Google sign-in. An empty allowlist intentionally blocks sign-in; configure production domains before deploying.
2. **Profile photo accepted plain HTTP and silently truncated profile fields (medium risk).** Profile updates now require valid HTTPS URLs, reject credential-bearing URLs, validate field lengths rather than silently truncating them, reject malformed/non-object JSON, and return private no-store responses for profile reads/updates.
3. **Added CI security gates.** The workflow runs dependency audit, ESLint, TypeScript checking, and a production build on pull requests and security branches.

## Risks still requiring verification or additional work

- **Authentication abuse / rate limiting — high priority.** No shared-store rate limit was confirmed in the inspected credentials flow. Add edge/WAF or shared-store limits for sign-in, registration, password verification, connection requests, posts, and message sends. Do not use process-local limits as the only production control in a serverless deployment.
- **Authorization coverage — high priority.** Continue verifying database-backed role and ownership checks for every server action, event mutation, society administration action, application decision, and admin endpoint. Route hiding or middleware alone is not authorization.
- **Connection integrity — medium priority.** The schema's unique constraint is directional (`requesterId, recipientId`), while application logic checks both directions before inserting. Concurrent opposite-direction requests may race. Add a canonical pair invariant/transaction strategy and test concurrent requests.
- **Private data exposure — medium priority.** Re-evaluate whether student roll numbers should be returned in connection/conversation responses and ensure all private API responses use `Cache-Control: private, no-store`.
- **Input/resource limits — medium priority.** Enforce request-body size limits and consistent schema validation on all JSON/form endpoints. Audit user-controlled URLs, file uploads, invite links, and outbound network requests for SSRF/open-redirect risks.
- **Database resilience — medium priority.** Verify migrations are committed and reproducible, production TLS/least-privilege credentials are used, and backups/restores are tested. The schema alone cannot prove the deployed database is synchronized.
- **Dependencies — unknown until CI completes.** `npm audit` has been added, but no successful audit/build/lint result is claimed until the workflow runs. Review advisories and upgrade with regression tests rather than blindly forcing major versions.
- **Secrets and history — unknown.** Review GitHub secret scanning/push protection, scan all Git history with gitleaks or TruffleHog, rotate any exposed credential, and verify provider/DNS secrets are configured only in deployment secret storage.
- **Browser security — needs deployment verification.** CSP is currently report-only and permissive. Gather real reports, then tighten and enforce it carefully. Confirm headers on the deployed host; HSTS preload should only be enabled if every covered subdomain supports HTTPS.
- **Tests — gap.** Add automated tests for unauthenticated access, cross-user IDOR attempts, student-vs-admin permissions, blocked/rejected connection behavior, malformed/oversized input, OAuth verified-email/domain enforcement, and account-linking edge cases.

## Required release checks

- Configure `COLLEGE_EMAIL_DOMAINS` with the exact production pilot domains. Do not add broad consumer mail providers.
- Wait for CI; resolve lint, type, build, and high-severity dependency findings.
- Test sign-in with allowed/disallowed domains and Google verified/unverified profiles.
- Test all mutation paths as a student, society manager, admin, and unauthenticated visitor.
- Verify production security headers, database TLS, backups, secret scanning, and account 2FA.
- Perform a separate dynamic security test before treating this as production-ready.

**Status:** Initial fixes are committed to the audit branch. This document deliberately distinguishes completed code changes from risks that still need tests, deployment access, or broader repository inspection.
