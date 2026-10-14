# Auth and deployment hardening

## Required before enabling student sign-in

Set `COLLEGE_EMAIL_DOMAINS` in the production deployment to a comma-separated allowlist of exact college email domains, for example:

```text
COLLEGE_EMAIL_DOMAINS=university.edu,example.ac.in
```

Use the domains actually approved for the pilot. Do not use broad consumer domains such as `gmail.com` or `outlook.com`. The application checks the email domain on the server; a browser-provided Google hosted-domain hint is not treated as proof. An empty allowlist intentionally blocks both Google and password sign-in until the list is configured.

GitHub OAuth has been removed from the provider configuration and sign-in UI. Google sign-in requires Google's verified-email claim. OAuth access, refresh, and ID tokens are no longer written during account creation or linking; existing tokens are cleared when that account next signs in. Review existing Account rows and clear any tokens left by older deployments as a separate one-time data operation.

## Before merging / deploying

- Install dependencies and run `npm ls next react`, `npm audit`, `npm run lint`, and `npm run build` against the branch.
- Test a verified Google account on an allowed college domain, a non-allowed domain, and a Google profile without a verified-email claim.
- Test password registration and sign-in with both allowed and disallowed domains.
- Exercise admin-only pages, server actions, and API routes as a student, a society manager, and an administrator. Verify every mutation checks database-backed role and record ownership; middleware is not a substitute for these checks.
- Test Content-Security-Policy-Report-Only in the deployed browser console and monitoring before considering an enforcing CSP.
- Verify the headers with SecurityHeaders, Mozilla Observatory, and the actual hosting configuration.
- Configure and verify SPF, DKIM, and DMARC in the DNS provider, and enable registrar/account 2FA and registrar lock.
- Enable GitHub secret scanning and push protection, Dependabot, and branch protection. Scan the full Git history with gitleaks or trufflehog; rotate every credential that was ever committed.
- Confirm production database TLS, least-privilege access, backups, and a tested restore process.
- Have Indian privacy counsel review the draft Privacy Policy and Terms against actual data flows and the current DPDP rules, especially the process for users under 18.
