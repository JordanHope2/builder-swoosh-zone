# Runbook — Going Live on jobequal.ch

## 0) One-time
- Swizzonic: create SSR app (Passenger). Create `~/tmp` on remote.
- DNS (jobequal.ch): A/AAAA -> Swizzonic host; CNAME `www` -> apex or host per Swizzonic.
- SSL: enable/auto-renew (Let’s Encrypt/Swizzonic). Verify CN = jobequal.ch.

## 1) Secrets (GitHub → repo → Settings → Secrets)
Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, BUILDER_PUBLIC_API_KEY, BUILDER_PRIVATE_KEY (if used server-side), SENTRY_DSN, POSTHOG_KEY (optional), SFTP_HOST, SFTP_PORT, SFTP_USERNAME, SFTP_PASSWORD (or key), SFTP_REMOTE_DIR, FTP_* (fallback), BUILDER_WEBHOOK_SECRET, SSH_USER.

## 2) First deploy
- `npm ci && npm run build`
- Push to `main` → GH Action uploads `/dist/server` + `/dist/spa` to Swizzonic via SFTP, then touches `tmp/restart.txt`.

## 3) Builder test
- In Builder, add a temporary “LIVE OK ✅” banner on homepage; publish.
- If webhook enabled, verify CI message; confirm page updates on https://jobequal.ch then remove banner.

## 4) Supabase
- Run migrations on **production**: `supabase db push --linked` (or SQL via dashboard).
- Verify RLS + auth providers. Seed minimal content only if needed.

## 5) Post-deploy smoke
- `node scripts/smoke.mjs https://jobequal.ch` → expect 200s; no mixed content.
- Attempt login (magic link); create a test job; confirm DB write & storage asset read.

## 6) Rollback
- Redeploy previous artifact via GH Workflow “Re-run with same SHA”.
- DNS/SSL unaffected.

## 7) Rotating keys
- Update secret in GitHub → re-run deploy → invalidate caches if needed.
