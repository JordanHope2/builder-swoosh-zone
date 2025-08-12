import os
from typing import List, Dict, Tuple
import httpx
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.scrapers.base_scraper import BaseScraper
from job_scraper.utils.normalize import create_job_hash, extract_skills_from_text

class AdzunaScraper(BaseScraper):
    """
    A scraper for Adzuna.
    """
    def __init__(self):
        self.app_id = os.environ.get("ADZUNA_APP_ID")
        self.api_key = os.environ.get("ADZUNA_API_KEY")
        if not self.app_id or not self.api_key:
            raise ValueError("Adzuna API credentials not configured.")

    async def scrape(self, page: int = 1, limit: int = 20, search: str = "", location: str = "") -> Tuple[List[Dict], List[Dict]]:
        """
        Scrapes job data from the Adzuna API and also returns company enrichment data.
        Returns a tuple: (list_of_jobs, list_of_company_data)
        """
        async with httpx.AsyncClient() as client:
            try:
                adzuna_api_url = f"https://api.adzuna.com/v1/api/jobs/ch/search/{page}"
                params = {
                    "app_id": self.app_id,
                    "app_key": self.api_key,
                    "results_per_page": limit,
                    "what": search,
                    "where": location,
                    "content-type": "application/json"
                }
                response = await client.get(adzuna_api_url, params=params)
                response.raise_for_status()
                data = response.json()

                jobs = []
                company_enrichment_data = []

                for result in data.get("results", []):
                    company_name = result.get("company", {}).get("display_name")
                    description = result.get("description")

                    job = {
                        "id": result.get("id"),
                        "title": result.get("title"),
                        "company_name": company_name,
                        "location": result.get("location", {}).get("display_name"),
                        "description": description,
                        "created": result.get("created"),
                        "url": result.get("redirect_url"),
                        "source": "Adzuna"
                    }
                    job["hash"] = create_job_hash(job)
                    jobs.append(job)

                    if company_name and description:
                        tech_stack = list(extract_skills_from_text(description))
                        company_data = {
                            "name": company_name,
                            "description": description,
                            "tech_stack": tech_stack
                        }
                        company_enrichment_data.append(company_data)

                return jobs, company_enrichment_data
            except httpx.HTTPStatusError as e:
                print(f"Error scraping Adzuna: {e}")
                return [], []
            except Exception as e:
                print(f"An unexpected error occurred while scraping Adzuna: {e}")
                return [], []

if __name__ == '__main__':
    import asyncio

    async def main():
        # You need to set ADZUNA_APP_ID and ADZUNA_API_KEY in your environment
        # for this to work.
        if "ADZUNA_APP_ID" not in os.environ or "ADZUNA_API_KEY" not in os.environ:
            print("Please set ADZUNA_APP_ID and ADZUNA_API_KEY environment variables to test the Adzuna scraper.")
            return

        scraper = AdzunaScraper()
        jobs, company_data = await scraper.scrape(limit=5)

        print(f"Found {len(jobs)} jobs from Adzuna.")
        if jobs:
            print("\nFirst job:")
            print(jobs[0])

        print(f"\nFound {len(company_data)} pieces of company enrichment data.")
        if company_data:
            print("\nFirst piece of company data:")
            print(company_data[0])

    asyncio.run(main())
