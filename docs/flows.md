# User and Data Flows

This document outlines the key user flows and data synchronization processes in the JobEqual platform.

## User Flows

### 1. Job Seeker: Search to Application
- **Search**: User searches for jobs using filters (location, salary, etc.). The request hits the Meilisearch index.
- **View Job**: User clicks on a job to see the details. The page is rendered with data from the Supabase database.
- **Apply**: User clicks "Apply" and fills out the application form. The application data is saved to the Supabase `applications` table.

### 2. Employer: Post a Job
- **Login**: Employer logs into their dashboard.
- **Create Job**: Employer fills out the "Post a Job" form.
- **Submit**: The job data is saved to the Supabase `jobs` table.
- **Trigger**: A Supabase trigger fires and upserts the new job into the Meilisearch index.

## Data Flows

### 1. Greenhouse Job Ingestion
- **Trigger**: A nightly cron job (`cron.yml`) runs the `ingest:greenhouse` script.
- **Fetch**: The script fetches new jobs from the Greenhouse API.
- **Normalize**: The data is normalized to match the `jobs` table schema.
- **Upsert**: The normalized data is upserted into the Supabase `jobs` table.

### 2. Search Re-indexing
- **Trigger**: A nightly cron job runs the `search:reindex` script.
- **Process**: The script can be used to perform a full re-index of the `jobs` table into Meilisearch if needed.

### 3. Release Process
- **Trigger**: A developer merges a pull request into the `main` branch.
- **Workflow**: The `release.yml` workflow is triggered.
- **Steps**:
  - `semantic-release` creates a new version and GitHub release.
  - The `migrate_db` job runs database migrations against Supabase.
  - The `deploy` job builds the frontend and deploys it to Netlify.
  - The `smoke_test` job runs Playwright tests against the live deployment.
