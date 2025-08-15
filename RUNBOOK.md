# Runbook for jobequal.ch

This document provides instructions for maintaining and managing the `jobequal.ch` website, including content updates, deployments, and rollbacks.

## 1. Overview of the Deployment Process

The deployment process is automated via a GitHub Actions workflow defined in `.github/workflows/deploy.yml`. The process is as follows:

1.  **Trigger:** A deployment is triggered by a push to the `main` branch or can be started manually from the GitHub Actions tab.
2.  **Build:** The workflow checks out the code, installs dependencies (`npm ci`), and builds the application (`npm run build`).
    *   During the build, it uses the `NEXT_PUBLIC_BUILDER_API_KEY` to fetch the latest content from Builder.io and render it as static HTML.
3.  **Deploy:** The built application (the contents of the `dist/spa` directory) is uploaded to your Swizzonic hosting via FTPS.
4.  **Cache Purge:** After the new files are uploaded, the workflow sends a request to the Cloudflare API to purge the entire cache. This ensures that users see the latest version of the site immediately.
5.  **Health Check:** The workflow performs a health check to ensure the site is live and responding with a `200 OK` status.

## 2. How to Update Content

There are two ways to update the site:

### a) Content Updates via Builder.io

For changes to page content, layout, or other elements managed in Builder.io:

1.  Go to your [Builder.io dashboard](https://builder.io/content).
2.  Make your changes to the desired page or content model.
3.  Click the **"Publish"** button in Builder.io.
4.  After publishing in Builder.io, you need to trigger a new deployment in GitHub to see the changes live. Go to the **Actions** tab in your GitHub repository, select the **"Deploy jobequal.ch"** workflow, and click **"Run workflow"** from the `main` branch.

### b) Code Updates via GitHub

For changes to the application's code (e.g., updating a React component, adding a new feature):

1.  Make your changes in a feature branch.
2.  Open a pull request to merge your changes into the `main` branch.
3.  Once the pull request is reviewed and merged, the deployment workflow will automatically trigger.

## 3. Rollback Procedure

There are two main ways to roll back to a previous version of the site:

### a) Reverting a Commit (Code Changes)

If a code change has caused a problem, you can revert the commit that introduced the issue:

1.  Go to the commit history in your GitHub repository.
2.  Find the commit you want to revert and click the "Revert" button.
3.  This will create a new commit that undoes the changes. Pushing this new commit to `main` will trigger a new deployment with the old code.

### b) Re-running a Previous Deployment (Content Changes)

If you need to roll back to a previous content version, you can re-run a specific, successful deployment from the past:

1.  Go to the **Actions** tab in your GitHub repository.
2.  Find a previous successful run of the "Deploy jobequal.ch" workflow.
3.  Click the **"Re-run all jobs"** button. This will re-run the build and deployment using the code and Builder.io content from that point in time.

### c) Emergency Rollback (Disabling Cloudflare Proxy)

If the site is completely down and you need to bypass the deployed version quickly, you can temporarily disable the Cloudflare proxy for your `A` and `CNAME` records. This will serve the site directly from your Swizzonic hosting, bypassing the CDN. This is a temporary measure until the underlying issue is fixed.

## 4. Required GitHub Secrets

For the deployment workflow to run successfully, you must configure the following secrets in your GitHub repository settings under **Settings > Secrets and variables > Actions**:

*   `BUILDER_IO_API_KEY`: Your public API key from Builder.io.
*   `CF_API_TOKEN`: Your Cloudflare API token with `Zone.Cache Purge` permissions.
*   `CF_ZONE_ID`: The Zone ID of your domain in Cloudflare.
*   `FTP_SERVER`: The FTPS server address for your Swizzonic hosting.
*   `FTP_USERNAME`: Your FTP username.
*   `FTP_PASSWORD`: Your FTP password.
*   `FTP_TARGET_DIR`: The directory on your server where the website files should be uploaded (e.g., `/httpdocs`, `/public_html`, or `/`). Check with Swizzonic for the correct value.
