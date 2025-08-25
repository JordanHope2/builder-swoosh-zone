import asyncio
import logging
from typing import List, Dict
import httpx
from bs4 import BeautifulSoup
import os
import sys
import re
import json

# Add the project root to the Python path to allow for absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient
from job_scraper.scrapers.base_scraper import BaseScraper
from job_scraper.utils.normalize import create_job_hash

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class JobupScraper(BaseScraper):
    """
    A scraper for jobup.ch.
    """
    def __init__(self):
        self.base_url = "https://www.jobup.ch"
        self.search_url = f"{self.base_url}/en/jobs/it-telecommunications/"

    async def scrape_job_details(self, client: httpx.AsyncClient, job_url: str) -> Dict | None:
        try:
            response = await client.get(job_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'lxml')

            # The job data is in a JSON-LD script tag
            scripts = soup.find_all('script', type='application/ld+json')
            job_data = None
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, list) and data:
                        for item in data:
                            if isinstance(item, dict) and item.get('@type') == 'JobPosting':
                                job_data = item
                                break
                    elif isinstance(data, dict) and data.get('@type') == 'JobPosting':
                        job_data = data
                        break
                except (json.JSONDecodeError, AttributeError):
                    continue
                if job_data:
                    break

            if job_data:
                title = job_data.get('title', "N/A")
                company = job_data.get('hiringOrganization', {}).get('name', "N/A")
                location = job_data.get('jobLocation', {}).get('address', {}).get('addressLocality', "N/A")

                description_html = job_data.get('description', '')
                description_soup = BeautifulSoup(description_html, 'lxml')
                description = description_soup.get_text(separator=' ', strip=True)
            else:
                # Fallback if no JSON-LD is found
                title = soup.find('h1').text.strip() if soup.find('h1') else "N/A"
                company = "N/A"
                location = "N/A"
                description = ""

            job = {
                "title": title,
                "company_name": company,
                "location": location,
                "description": description,
                "date_posted": "", # Not available
                "url": job_url,
                "source": "jobup.ch",
            }
            job["hash"] = create_job_hash(job)
            return job
        except Exception as e:
            logging.error(f"Error scraping job details from {job_url}: {e}", exc_info=True)
            return None

    async def scrape(self) -> List[Dict]:
        """
        Scrapes job data from jobup.ch by finding job detail links on the search results page.
        """
        logging.info("Scraping jobup.ch...")
        jobs = []
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.search_url)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'lxml')

                # Find all links that match the job detail page pattern
                job_links = soup.find_all('a', href=re.compile(r'/en/jobs/detail/[\w-]+/'))

                logging.info(f"Found {len(job_links)} unique job links on the page.")

                tasks = []
                scraped_urls = set()
                for link in job_links:
                    job_url = self.base_url + link['href']
                    if job_url not in scraped_urls:
                        tasks.append(self.scrape_job_details(client, job_url))
                        scraped_urls.add(job_url)

                # Limit to 10 jobs for testing
                scraped_jobs = await asyncio.gather(*tasks[:10])
                jobs = [job for job in scraped_jobs if job]

            logging.info(f"Found and processed {len(jobs)} jobs from jobup.ch.")
            return jobs
        except Exception as e:
            logging.error(f"Error scraping jobup.ch: {e}", exc_info=True)
            return []

async def main():
    """
    Main function to run the scraper and upsert the data.
    """
    logging.info("Starting jobup.ch scraper...")
    scraper = JobupScraper()
    jobs = await scraper.scrape()

    if jobs:
        logging.info(f"Attempting to upsert {len(jobs)} jobs to Supabase...")
        supabase_client = SupabaseClient()
        supabase_client.upsert_jobs(jobs)
    else:
        logging.info("No jobs found to upsert.")

    logging.info("jobup.ch scraper finished.")

if __name__ == '__main__':
    asyncio.run(main())
