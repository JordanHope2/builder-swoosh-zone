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

# Candidate Profile Sources

This section documents potential sources for scraping candidate profiles. The goal is to find publicly available data on tech professionals that can be used for matching against open job positions in Switzerland.

## 1. GitHub

-   **Type**: API
-   **URL**: `https://api.github.com/`
-   **Access**: Public API with rate limits. Authentication with a personal access token is recommended to increase rate limits.
-   **Key Endpoints**:
    -   `GET /search/users`: Allows searching for users based on criteria like location, programming language, and number of followers. This is the primary endpoint for discovering relevant candidates.
    -   `GET /users/{username}`: Retrieves detailed profile information for a specific user, including name, bio, company, blog/website, and social accounts.
-   **Data Points**: `name`, `location`, `bio`, `company`, `blog`, `email` (often null), repositories (to infer skills).
-   **Pros**:
    -   Rich source of developer talent.
    -   Powerful search capabilities allow for targeted discovery (e.g., "users in Zurich with >50 followers who code in Python").
    -   Well-documented and widely used API.
-   **Cons**:
    -   Location and job-related fields are free-text, requiring significant normalization.
    -   Public email is often not available, making contact difficult without further enrichment.
    -   Requires careful handling of rate limits.

## 2. GitLab

-   **Type**: API
-   **URL**: `https://gitlab.com/api/v4/`
-   **Access**: Public API with rate limits. Authentication is required for most useful actions.
-   **Key Endpoints**:
    -   `GET /users`: Can be used to list or search for users. The `search` parameter allows for a fuzzy search on name, username, and public email.
    -   `GET /users/:id`: Retrieves detailed profile information, including `job_title`, `organization`, `location`, and social links (`linkedin`, `twitter`, `github`).
-   **Data Points**: `name`, `username`, `bio`, `location`, `organization`, `job_title`, social profiles.
-   **Pros**:
    -   Profile schema includes explicit `job_title` and `organization` fields, which is highly valuable.
    -   Provides direct links to other professional profiles like LinkedIn.
-   **Cons**:
    -   The user search functionality is less powerful than GitHub's. It's a general text search rather than a structured search on specific fields like location or skills.
    -   Discovering a targeted list of users (e.g., "all developers in Switzerland") is more challenging than on GitHub.
