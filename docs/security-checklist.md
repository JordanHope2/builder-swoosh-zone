# Security Checklist

This document serves as a checklist for ensuring the security of the JobEqual platform.

## Infrastructure
- [x] Supabase Row Level Security (RLS) is enabled and policies are in place.
- [x] Secrets are managed via GitHub Secrets and hosting provider environment variables, not committed to the repository.
- [x] The `main` branch is protected, requiring pull requests and status checks to pass before merging.
- [x] `gitleaks` or similar secret scanning is active in the repository.
- [x] `CodeQL` is configured to scan for vulnerabilities on every pull request.

## Application
- [ ] All user input is sanitized on the backend before being stored in the database.
- [ ] All API endpoints have appropriate authentication and authorization checks.
- [ ] Passwords are not stored in plain text (handled by Supabase Auth).
- [ ] Cross-Site Scripting (XSS) is mitigated by using a modern frontend framework (React) and not using `dangerouslySetInnerHTML`.
- [ ] Cross-Site Request Forgery (CSRF) is mitigated (handled by Supabase's JWT-based auth).
- [ ] Dependencies are regularly scanned for vulnerabilities (can be done with `npm audit` or GitHub Dependabot alerts).

## Compliance
- [x] A data retention policy is in place and automated via a cron job.
- [x] A process for handling Data Subject Access Requests (DSAR) is defined.
- [ ] A cookie consent banner is implemented.

## Payments
- [ ] Stripe webhooks are verified using the webhook signature.
- [ ] PCI compliance is handled by Stripe (no sensitive card data touches the application servers).
