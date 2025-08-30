# Runbook

This document provides procedures for common operational tasks.

## Responding to a Production Outage

1.  **Acknowledge**: Acknowledge the incident and notify the team.
2.  **Investigate**:
    -   Check Sentry for new errors.
    -   Check the Netlify deployment status.
    -   Check the Supabase status page.
3.  **Remediate**:
    -   If the outage was caused by a recent deployment, the fastest way to remediate is to roll back to the previous successful deployment in the Netlify UI.
    -   If the issue is with Supabase or another third-party service, update the status page and communicate with the provider.
4.  **Communicate**: Keep stakeholders updated on the progress.
5.  **Post-mortem**: After the incident is resolved, conduct a post-mortem to understand the root cause and prevent it from happening again.

## Handling a Database Migration Failure

The `release.yml` workflow is designed to fail if the database migration fails.

1.  **Identify the failure**: The `migrate_db` job in the GitHub Actions workflow will show an error.
2.  **Investigate the logs**: Read the logs from the failed job to understand why the migration failed. It is likely due to an issue with the SQL in the migration file.
3.  **Fix the migration**: Create a new pull request with a fix for the migration file.
4.  **Re-run the workflow**: Once the fix is merged, the `release.yml` workflow will run again.

## Seeding the Database Locally

To reset your local database and seed it with initial data, run:
```bash
npm run db:seed
```
This command uses `supabase db reset`, which will drop the local database, re-run all migrations, and then run the `supabase/seed.sql` script.
