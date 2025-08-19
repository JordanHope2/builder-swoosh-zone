import asyncio
import logging
from typing import List, Dict
import rss_parser
import os
import sys

# Add the project root to the Python path to allow for absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient
from job_scraper.scrapers.base_scraper import BaseScraper
from job_scraper.utils.normalize import create_job_hash

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class SwissDevJobsScraper(BaseScraper):
    """
    A scraper for SwissDevJobs.ch.
    """
    def __init__(self):
        self.parser = rss_parser.RSSParser()

    async def scrape(self) -> List[Dict]:
        """
        Scrapes job data from the SwissDevJobs.ch RSS feed.
        """
        logging.info("Scraping SwissDevJobs.ch RSS feed...")
        try:
            feed = await self.parser.parse_from_url('https://swissdevjobs.ch/jobs/rss')
            jobs = []
            for item in feed.items:
                job = {
                    "title": item.title,
                    "company_name": item.creator, # Use company_name to match schema
                    "location": item.get("location", item.title), # Fallback to title for location
                    "description": item.get("description", item.get("contentSnippet", "")),
                    "date_posted": item.pubDate,
                    "url": item.link,
                    "source": "SwissDevJobs.ch"
                }
                job["hash"] = create_job_hash(job)
                jobs.append(job)
            logging.info(f"Found {len(jobs)} jobs from SwissDevJobs.ch.")
            return jobs
        except Exception as e:
            logging.error(f"Error scraping SwissDevJobs.ch: {e}", exc_info=True)
            return []

async def main():
    """
    Main function to run the scraper and upsert the data.
    This function can be imported and called by other scripts.
    """
    logging.info("Starting SwissDevJobs scraper...")
    scraper = SwissDevJobsScraper()
    jobs = await scraper.scrape()

    if jobs:
        logging.info(f"Attempting to upsert {len(jobs)} jobs to Supabase...")
        supabase_client = SupabaseClient()
        supabase_client.upsert_jobs(jobs)
    else:
        logging.info("No jobs found to upsert.")

    logging.info("SwissDevJobs scraper finished.")

if __name__ == '__main__':
    # This allows the script to be run directly for testing.
    asyncio.run(main())
