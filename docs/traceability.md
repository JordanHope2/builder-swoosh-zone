# Requirements Traceability Matrix

This document maps the requirements outlined in `plan.md` to the actual implementation components in the codebase and the corresponding verification methods (tests, workflows).

There is a notable architectural difference: `plan.md` specifies a Next.js frontend, whereas the current implementation uses a **Vite + React (SPA) + Express** stack with custom server-side rendering. This matrix reflects the existing implementation.

---

### A) Core Application & Frontend

| Requirement / Feature (from `plan.md`) | Code / Infrastructure Component(s) | Tests / Verification Workflow |
| :--- | :--- | :--- |
| **Frontend Framework** | `client/` (React 18, Vite), `package.json` | `npm run build:client`, `npm run lint`, `npm run typecheck` |
| **SSR & Hosting** | `server/index.ts` (Express server), `vite.config.server.ts`, Phusion Passenger on Swizzonic | `.github/workflows/deploy-ssr.yml` |
| **Job Browsing & Search** | `client/pages/Jobs.tsx`, `client/pages/JobSearch.tsx` | `e2e/smoke.spec.ts` |
| **Job Detail Page** | `client/pages/JobDetails.tsx` | `e2e/smoke.spec.ts` |
| **Candidate Profile & Dashboard** | `client/pages/CandidateProfile.tsx`, `client/pages/CandidateDashboard.tsx` | Protected routes, requires session |
| **Recruiter Interface** | `client/pages/RecruiterDashboard.tsx`, `client/pages/PostJob.tsx` | Protected routes, requires session |
| **Swipe-based Job Discovery** | `client/pages/SwipeDiscovery.tsx`, `client/components/EnhancedSwipeJobDiscovery.tsx` | Manual test, UI component stories |
| **Multilingual Support** | `client/contexts/LanguageContext.tsx`, `client/components/LanguageSwitcher.tsx` | Manual E2E testing |

### B) Backend & Data

| Requirement / Feature (from `plan.md`) | Code / Infrastructure Component(s) | Tests / Verification Workflow |
| :--- | :--- | :--- |
| **Backend Server** | `server/` (Node.js, Express) | `npm run build:server`, `npm start` |
| **Database Provider** | Supabase (PostgreSQL) | `supabase/` directory, `package.json` (`@supabase/supabase-js`) |
| **Database Schema** | `supabase/migrations/`, `shared/types/supabase.ts` | `npm run db:migrate` |
| **Data Seeding** | `supabase/seed.sql` | `npm run db:seed` |
| **REST API Endpoints** | `server/routes/` (e.g., `jobs.ts`, `candidates.ts`, `companies.ts`) | `server/routes/*.test.ts` (Vitest) |
| **User Authentication**| `server/middleware/auth.ts`, Supabase Auth | `server/middleware/auth.test.ts` |
| **Database Policies (RLS)** | Supabase Dashboard (managed outside repo) | Manual verification in Supabase UI |
| **Cloud Storage** | Supabase Storage (for CVs, etc.) | `client/pages/CVUpload.tsx` |

### C) Integrations & AI

| Requirement / Feature (from `plan.md`) | Code / Infrastructure Component(s) | Tests / Verification Workflow |
| :--- | :--- | :--- |
| **Builder.io (Headless CMS)** | `package.json` (`@builder.io/sdk-react`), `client/lib/builderConfig.ts` | Manual verification on live site |
| **AI Services (OpenAI)** | `package.json` (`openai`), `server/services/aiService.ts` | Integration tests (requires secrets) |
| **AI Resume Parsing** | `client/pages/CVUpload.tsx` -> `/api/parse-resume` (hypothetical) | - |
| **AI Job-Candidate Matching** | `server/routes/match.ts`, `client/services/aiMatchService.ts` | - |
| **AI Assistant Chatbot** | `client/components/AIChatbot.tsx`, `client/components/EnhancedAIChatbot.tsx` | - |
| **Observability (Sentry)** | `package.json` (`@sentry/react`, `@sentry/node`), `vite.config.ts` | Manual verification in Sentry dashboard |

### D) CI/CD & Quality

| Requirement / Feature (from `plan.md`) | Code / Infrastructure Component(s) | Tests / Verification Workflow |
| :--- | :--- | :--- |
| **CI Workflow** | `.github/workflows/ci.yml` | GitHub Actions |
| **SSR Deployment** | `.github/workflows/deploy-ssr.yml` | GitHub Actions |
| **Code Linting** | `.eslintrc.cjs`, `package.json` (`eslint`) | `npm run lint` |
| **Unit & Integration Tests** | `tests/`, `*.test.ts` files, `vitest.config.ts` | `npm test` |
| **E2E / Smoke Tests** | `e2e/` directory, `playwright.config.ts` | `npm run smoke:prod` |
| **Security Scanning** | `.github/workflows/security.yml` (e.g., Gitleaks) | GitHub Actions |
| **Code Formatting** | `.prettierrc` | `npm run format.fix` |
| **Bundle Size Limit** | `package.json` (`size-limit`) | `npm run size` |
| **Lighthouse CI** | `lighthouserc.js` | LHCI GitHub App / `lhci` command |
