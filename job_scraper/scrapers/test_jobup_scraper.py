import asyncio
import os
import sys
from jobup_scraper import JobupScraper

# Add the project root to the Python path to allow for absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.supabase_client import SupabaseClient

async def test_scraper():
    """
    Tests the JobupScraper and the database connection.
    """
    print("Testing JobupScraper...")
    scraper = JobupScraper()
    jobs = await scraper.scrape()

    if jobs:
        print(f"Found {len(jobs)} jobs.")
        # Print the first job for verification
        print(jobs[0])

        print("\nTesting database connection...")
        supabase_client = SupabaseClient()
        if supabase_client.client:
            print("Supabase client created successfully.")
            try:
                supabase_client.upsert_jobs(jobs)
                print("Successfully upserted jobs to the database.")
            except Exception as e:
                print(f"Error upserting jobs to the database: {e}")
        else:
            print("Supabase client could not be created. Please check your .env file and Supabase credentials.")

    else:
        print("No jobs found.")

if __name__ == '__main__':
    asyncio.run(test_scraper())
