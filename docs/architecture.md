# Architecture Overview

This document provides a high-level overview of the technical architecture of the JobEqual platform.

## Frontend

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context and TanStack Query
- **Routing**: React Router

## Backend

- **Provider**: Supabase
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions for serverless logic

## Search

- **Provider**: Meilisearch
- **Integration**: Self-hosted Meilisearch instance, kept in sync via Supabase triggers and nightly jobs.

## CI/CD

- **Provider**: GitHub Actions
- **Workflows**:
  - `ci.yml`: Core quality checks (lint, test, build, etc.)
  - `e2e.yml`: End-to-end tests with Playwright
  - `release.yml`: Automated releases to production (Netlify)
  - `cron.yml`: Scheduled jobs for data ingestion, maintenance, etc.

## Hosting

- **Frontend**: Netlify
- **Backend**: Supabase
- **Search**: Self-hosted (e.g., on DigitalOcean or similar)
