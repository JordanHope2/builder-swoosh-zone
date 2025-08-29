# CDN Setup for User Assets

This document provides instructions on how to set up a Content Delivery Network (CDN) with Cloudflare for your Supabase Storage bucket. This will improve the performance of loading user-uploaded assets like resumes and avatars.

## Prerequisites

-   A Cloudflare account with your domain configured.
-   A Supabase project with a storage bucket for user assets.

## 1. Create a CNAME Record in Cloudflare

1.  **Get your Supabase Storage URL:** In your Supabase dashboard, go to **Storage** and select your bucket. The URL will be in the format `https://<project-ref>.supabase.co/storage/v1/object/public/<bucket-name>`. You only need the hostname part: `<project-ref>.supabase.co`.
2.  **Go to your Cloudflare dashboard:** Select your domain and go to the **DNS** settings.
3.  **Add a new CNAME record:**
    -   **Type:** `CNAME`
    -   **Name:** `assets` (or any subdomain you prefer, e.g., `cdn`, `storage`)
    -   **Target:** Your Supabase Storage hostname (e.g., `your-project-ref.supabase.co`).
    -   **Proxy status:** Make sure it's set to **Proxied** (orange cloud).
    -   Click **Save**.

## 2. Configure Cloudflare Cache Rules

To ensure that the assets are cached correctly, you should create a cache rule in Cloudflare.

1.  **Go to your Cloudflare dashboard:** Select your domain and go to the **Caching** > **Cache Rules** section.
2.  **Create a new cache rule:**
    -   **Rule name:** `Cache Supabase Assets`
    -   **When incoming requests match...**
        -   **Field:** `Hostname`
        -   **Operator:** `equals`
        -   **Value:** `assets.yourdomain.com` (the subdomain you created in the previous step).
    -   **Then...**
        -   **Cache eligibility:** `Eligible for cache`
        -   **Edge TTL:** `a month` (or your desired cache duration).
        -   **Browser TTL:** `a day` (or your desired duration).
    -   **Deploy** the rule.

## 3. Update Application Code

After configuring the CDN, you need to update the application to use the new CDN URL. I will handle this part of the process. The application will be updated to construct URLs in the format `https://assets.yourdomain.com/storage/v1/object/public/<bucket-name>/<file-path>`.
