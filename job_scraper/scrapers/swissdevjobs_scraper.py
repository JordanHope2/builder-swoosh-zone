import asyncio
from typing import List, Dict
import rss_parser
import os
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))


from job_scraper.scrapers.base_scraper import BaseScraper
from job_scraper.utils.normalize import normalize_title, normalize_company, create_job_hash

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
        try:
            # Corrected method name
            feed = await self.parser.parse_from_url('https://swissdevjobs.ch/jobs/rss')
            jobs = []
            for item in feed.items:
                job = {
                    "title": item.title,
                    "company": item.creator,
                    "canton": self.extract_canton(item.title), # Placeholder
                    "location": item.get("location", ""),
                    "description": item.get("contentSnippet", ""),
                    "date_posted": item.pubDate,
                    "url": item.link,
                    "source": "SwissDevJobs.ch"
                }
                job["hash"] = create_job_hash(job)
                jobs.append(job)
            return jobs
        except Exception as e:
            print(f"Error scraping SwissDevJobs.ch: {e}")
            return []

    def extract_canton(self, title: str) -> str:
        """
        A simple placeholder for canton extraction.
        This will be improved later.
        """
        # A very basic implementation. This needs to be improved.
        if "zurich" in title.lower():
            return "ZH"
        if "geneva" in title.lower():
            return "GE"
        if "bern" in title.lower():
            return "BE"
        return ""

if __name__ == '__main__':
    async def main():
        scraper = SwissDevJobsScraper()
        jobs = await scraper.scrape()
        print(f"Found {len(jobs)} jobs.")
        if jobs:
            print("First job:")
            print(jobs[0])

    asyncio.run(main())
