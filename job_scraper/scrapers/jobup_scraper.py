import asyncio
import logging
import httpx
from bs4 import BeautifulSoup
import json
import os
import sys
from typing import List, Dict

# Add the project root to the Python path to allow for absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient
from job_scraper.scrapers.base_scraper import BaseScraper
from job_scraper.utils.normalize import create_job_hash

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class JobupScraper(BaseScraper):
    """
    A scraper for Jobup.ch.
    """
    def __init__(self):
        self.url = "https://www.jobup.ch/en/jobs/?location=switzerland%20switzerland&term="

    async def scrape(self) -> List[Dict]:
        """
        Scrapes job data from Jobup.ch.
        """
        logging.info("Scraping Jobup.ch...")
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.url)
                response.raise_for_status()
        except httpx.RequestError as e:
            logging.error(f"Error fetching the page: {e}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        scripts = soup.find_all('script')

        init_data = None
        for script in scripts:
            if script.string and '__INIT__' in script.string:
                # Extract the JSON part from the script tag
                # Extract the JSON part from the script tag
                # The JSON object starts after '__INIT__ = ' and ends before the next semicolon.
                start_str = '__INIT__ = '
                start_index = script.string.find(start_str)
                if start_index != -1:
                    start_index += len(start_str)
                    end_index = script.string.find(';', start_index)
                    if end_index != -1:
                        json_str = script.string[start_index:end_index]
                        try:
                            init_data = json.loads(json_str)
                            break
                        except json.JSONDecodeError as e:
                            logging.error(f"Error decoding JSON from script tag: {e}")
                            continue

        if not init_data:
            logging.error("Could not find the __INIT__ data object in the page.")
            return []

        jobs = []
        try:
            job_listings = init_data['vacancy']['results']['main']['results']
            for item in job_listings:
                job = {
                    "title": item.get("title"),
                    "company_name": item.get("company", {}).get("name"),
                    "location": item.get("place"),
                    "description": item.get("template", {}).get("text", ""),
                    "date_posted": item.get("publicationDate"),
                    "url": f"https://www.jobup.ch/en/jobs/detail/{item.get('id')}/",
                    "source": "Jobup.ch",
                }
                job["hash"] = create_job_hash(job)
                jobs.append(job)
        except KeyError as e:
            logging.error(f"Error parsing job listings from __INIT__ data: {e}")
            return []

        logging.info(f"Found and processed {len(jobs)} jobs from Jobup.ch.")
        return jobs

async def main():
    """
    Main function to run the scraper and upsert the data.
    """
    logging.info("Starting Jobup.ch scraper...")
    scraper = JobupScraper()
    jobs = await scraper.scrape()

    if jobs:
        logging.info(f"Attempting to upsert {len(jobs)} jobs to Supabase...")
        supabase_client = SupabaseClient()
        supabase_client.upsert_jobs(jobs)
    else:
        logging.info("No jobs found to upsert.")

    logging.info("Jobup.ch scraper finished.")

if __name__ == '__main__':
    # This allows the script to be run directly for testing.
    asyncio.run(main())
