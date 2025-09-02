# Requirements Traceability — JobEqual Live

| plan item / goal | code / infra component | tests / workflows |
|---|---|---|
| Production SSR on Swizzonic | `server/` (SSR entry), `vite.config.server.ts`, `.github/workflows/deploy-ssr.yml` | `CI: deploy-ssr.yml` preflight + restart; scripts/smoke.mjs |
| Builder.io live content | `client/` Builder SDK init, `.env` BUILDER keys, `server/routes/builder-webhook.ts` | webhook e2e: publish → deploy/cache purge |
| Supabase DB/Auth/Storage | `supabase/` migrations + RLS, `shared/types/supabase.ts`, `server/lib/supa.ts` | vitest smoke (staging), `/healthz` DB ping |
| Secrets single source | `.env.production.example`, `scripts/ci/preflight.mjs` | CI “fail fast” if critical secrets missing |
| Lint/size/LHCI gates | `eslint.config.js`, `size-limit.json`, `lighthouserc.js` | `npm run lint`, `npm run size`, `npm run lhci` |
| Security | `.gitleaks.toml`, CSP/CORS in SSR | `gitleaks` GH Action; simple CSP test |
| Observability | Sentry DSN wired, `/healthz` | Sentry test error route; uptime check |
