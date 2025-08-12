import os
import requests
import time
import sys
from typing import Dict, Any, List

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient
from job_scraper.utils.normalize import (
    normalize_location,
    extract_skills_from_text,
    normalize_url
)

class GitHubCandidatesScraper:
    """
    A scraper to find and collect profiles of potential candidates from GitHub.
    """
    def __init__(self, api_token: str):
        if not api_token:
            raise ValueError("GitHub API token is required.")
        self.api_token = api_token
        self.db_client = SupabaseClient()
        self.base_url = "https://api.github.com"

    def get_headers(self) -> Dict[str, str]:
        return {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"Bearer {self.api_token}"
        }

    def run(self, search_query: str = "location:switzerland followers:>50", max_pages: int = 1):
        """
        Runs the scraper to find users matching a query.

        :param search_query: The query string for the GitHub user search API.
        :param max_pages: The maximum number of pages to scrape.
        """
        print(f"Starting GitHub candidate scrape with query: '{search_query}'")
        headers = self.get_headers()

        for page in range(1, max_pages + 1):
            search_url = f"{self.base_url}/search/users"
            params = {"q": search_query, "per_page": 100, "page": page}

            try:
                response = requests.get(search_url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                users = data.get("items", [])

                if not users:
                    print("No more users found. Stopping.")
                    break

                print(f"Found {len(users)} users on page {page}.")
                for user in users:
                    self.scrape_profile(user['login'])
                    # Be respectful of the API rate limit
                    time.sleep(1)

            except requests.exceptions.RequestException as e:
                print(f"Error searching for users on page {page}: {e}")
                break

        print("GitHub candidate scrape finished.")

    def scrape_profile(self, username: str):
        """
        Scrapes a single user profile and saves it to the database.
        """
        profile_url = f"{self.base_url}/users/{username}"
        headers = self.get_headers()

        try:
            response = requests.get(profile_url, headers=headers)
            response.raise_for_status()
            profile_data = response.json()

            print(f"Successfully scraped profile for user: {username}")
            # In a real implementation, we would save this to the DB.
            # For now, we'll just print a summary.

            candidate = self.normalize_candidate(profile_data)
            skills = extract_skills_from_text(candidate.get('bio', ''))

            print(f"  - Name: {candidate.get('name')}")
            print(f"  - Location: {candidate.get('location')}")
            print(f"  - Job Title: {candidate.get('company')}") # Using company as a proxy
            print(f"  - Extracted Skills: {skills}")

            # Upsert candidate and their skills to the database
            candidate_id = self.db_client.upsert_candidate(candidate)
            if candidate_id and skills:
                self.db_client.upsert_candidate_skills(candidate_id, skills)

        except requests.exceptions.RequestException as e:
            print(f"Error scraping profile for {username}: {e}")

    def normalize_candidate(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforms the raw API response for a user profile into the candidate schema.
        """
        return {
            "source": "github",
            "source_id": str(profile_data.get("id")),
            "username": profile_data.get("login"),
            "name": profile_data.get("name"),
            "email": profile_data.get("email"),
            "location": profile_data.get("location"),
            "company": profile_data.get("company"),
            "job_title": None, # GitHub doesn't have an explicit job title field
            "bio": profile_data.get("bio"),
            "website_url": normalize_url(profile_data.get("blog")),
            "linkedin_url": None, # Not available from GitHub API
            "twitter_url": f"https://twitter.com/{profile_data['twitter_username']}" if profile_data.get("twitter_username") else None,
            "github_url": profile_data.get("html_url"),
            "avatar_url": profile_data.get("avatar_url"),
            "followers_count": profile_data.get("followers"),
            "raw_data": profile_data,
            "last_scraped_at": time.strftime('%Y-%m-%d %H:%M:%S')
        }

if __name__ == '__main__':
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        print("Error: GITHUB_TOKEN environment variable not set.")
        print("Please set it to your GitHub Personal Access Token.")
    else:
        scraper = GitHubCandidatesScraper(api_token=github_token)
        # Run a small test scrape
        scraper.run(search_query="location:switzerland followers:>10", max_pages=1)
