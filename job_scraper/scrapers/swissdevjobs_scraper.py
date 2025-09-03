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
from openai import OpenAI

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class EmbeddingService:
    """
    A service to generate text embeddings using OpenAI's API.
    """
    def __init__(self):
        # The OpenAI client will automatically use the OPENAI_API_KEY environment variable.
        try:
            self.client = OpenAI()
            self.model = "text-embedding-ada-002"
            logging.info("OpenAI client initialized successfully.")
        except Exception as e:
            logging.error(f"Failed to initialize OpenAI client: {e}", exc_info=True)
            self.client = None

    def get_embedding(self, text: str):
        """
        Generates an embedding for the given text.

        Args:
            text: The text to embed.

        Returns:
            A list of floats representing the embedding, or None if an error occurs.
        """
        if not self.client:
            logging.error("OpenAI client is not available. Cannot generate embedding.")
            return None

        if not text or not isinstance(text, str):
            logging.warning("Invalid input text provided for embedding.")
            return None

        try:
            # Replace newlines, which can negatively affect performance.
            text = text.replace("\n", " ")
            response = self.client.embeddings.create(input=[text], model=self.model)
            embedding = response.data[0].embedding
            logging.info(f"Successfully generated embedding for text snippet: '{text[:50]}...'")
            return embedding
        except Exception as e:
            logging.error(f"An error occurred while generating embedding: {e}", exc_info=True)
            return None

class SwissDevJobsScraper(BaseScraper):
    """
    A scraper for SwissDevJobs.ch.
    """
    def __init__(self):
        self.parser = rss_parser.RSSParser()

    async def scrape(self) -> List[Dict]:
        """
        Scrapes job data from the SwissDevJobs.ch RSS feed and generates embeddings.
        """
        logging.info("Scraping SwissDevJobs.ch RSS feed...")
        try:
            feed = await self.parser.parse_from_url('https://swissdevjobs.ch/jobs/rss')
            embedding_service = EmbeddingService()

            jobs = []
            for item in feed.items:
                description = item.get("description", item.get("contentSnippet", ""))
                job = {
                    "title": item.title,
                    "company_name": item.creator,
                    "location": item.get("location", item.title),
                    "description": description,
                    "date_posted": item.pubDate,
                    "url": item.link,
                    "source": "SwissDevJobs.ch",
                    "embedding": None # Default to None
                }
                job["hash"] = create_job_hash(job)

                # Generate embedding
                embedding_text = f"Job Title: {item.title}\nDescription: {description}"
                embedding = embedding_service.get_embedding(embedding_text)
                if embedding:
                    job["embedding"] = embedding

                jobs.append(job)

            logging.info(f"Found and processed {len(jobs)} jobs from SwissDevJobs.ch.")
            return jobs
        except Exception as e:
            logging.error(f"Error scraping SwissDevJobs.ch: {e}", exc_info=True)
            return []

async def main():
    """
    Main function to run the scraper and upsert the data.
    This function can be imported and called by other scripts.
    Returns the number of jobs scraped.
    """
    logging.info("Starting SwissDevJobs scraper...")
    scraper = SwissDevJobsScraper()
    jobs = await scraper.scrape()
    num_jobs = len(jobs)

    if jobs:
        logging.info(f"Attempting to upsert {num_jobs} jobs to Supabase...")
        supabase_client = SupabaseClient()
        supabase_client.upsert_jobs(jobs)
    else:
        logging.info("No jobs found to upsert.")

    logging.info("SwissDevJobs scraper finished.")
    return num_jobs

if __name__ == '__main__':
    # This allows the script to be run directly for testing.
    asyncio.run(main())
