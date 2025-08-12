# API Documentation for Frontend Integration

This document provides details on the API endpoints available to connect the frontend to the backend data.

---

## 1. Get All Companies

-   **Endpoint:** `/api/companies`
-   **Method:** `GET`
-   **Description:** Retrieves a list of all company profiles stored in the database. The companies are returned in descending order of their creation date.
-   **Example Response:**
    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Example Tech Inc.",
        "website_url": "https://example.tech",
        "location": "Zurich",
        "address": "Example Street 1, 8000 Zurich",
        "company_size": 150,
        "phone": null,
        "industry": "Software",
        "legal_entity_type": "AG",
        "zefix_uid": "CHE-123.456.789",
        "created_at": "2025-08-12T10:00:00.000Z",
        "updated_at": "2025-08-12T10:00:00.000Z",
        "description": "A leading provider of innovative tech solutions.",
        "tech_stack": ["React", "Node.js", "AWS"],
        "offers_visa_sponsorship": true,
        "tags": ["fintech", "fast-paced"]
      }
    ]
    ```

---

## 2. Get All Candidates

-   **Endpoint:** `/api/candidates`
-   **Method:** `GET`
-   **Description:** Retrieves a list of all scraped candidate profiles from the database. The candidates are returned in descending order of their creation date.
-   **Example Response:**
    ```json
    [
      {
        "id": 1,
        "source": "github",
        "source_id": "12345",
        "username": "janedoe",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "location": "Geneva, Switzerland",
        "company": "Tech Solutions AG",
        "job_title": "Senior Software Engineer",
        "bio": "Passionate about building scalable web applications.",
        "website_url": "https://janedoe.dev",
        "linkedin_url": "https://linkedin.com/in/janedoe",
        "twitter_url": null,
        "github_url": "https://github.com/janedoe",
        "avatar_url": "https://github.com/avatars/janedoe",
        "followers_count": 150,
        "raw_data": { "...original json from github..." },
        "created_at": "2025-08-12T11:00:00.000Z",
        "updated_at": "2025-08-12T11:00:00.000Z",
        "last_scraped_at": "2025-08-12T11:00:00.000Z"
      }
    ]
    ```
