# Swiss Job Data Sources

This document lists compliant and publicly accessible sources for aggregating job data in Switzerland.

## 1. SwissDevJobs.ch (RSS Feed)

-   **Base URL:** `https://swissdevjobs.ch/`
-   **Ingestion Method:** RSS Feed
-   **Example Feed URL:** `https://swissdevjobs.ch/jobs/rss`
-   **Rate Limit:** Standard RSS polling etiquette should be followed. A request every 15-30 minutes is reasonable.
-   **Allowed Usage:** RSS feeds are intended for public consumption and syndication. No explicit restrictions found in `robots.txt` for the RSS feed.
-   **Key Fields Available:** `title`, `company` (creator), `location`, `description` (contentSnippet), `link`, `pubDate`.

## 2. Adzuna (API)

-   **Base URL:** `https://www.adzuna.com/`
-   **Ingestion Method:** Public API
-   **Example Endpoint:** `https://api.adzuna.com/v1/api/jobs/ch/search/1`
-   **Rate Limit:** The Adzuna API has a rate limit which should be respected. Check their terms of service for specifics.
-   **Allowed Usage:** Requires API key and App ID. Usage is subject to Adzuna's terms of service.
-   **Key Fields Available:** `id`, `title`, `company`, `location`, `description`, `link` (redirect_url), `created`.

## 3. Arbeit.swiss / Job-Room.ch (Official Portal)

-   **Base URL:** `https://www.job-room.ch/`
-   **Ingestion Method:** The public website is a Single Page Application (SPA). The public API at `https://api.job-room.ch/` is for **posting** jobs, not for public data retrieval.
-   **Status:** Currently **not viable** for public data scraping without using a headless browser to discover the internal API endpoints used by the frontend. This would require more advanced tooling and is outside the scope of simple, compliant scraping.
