import asyncio
import os
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from job_scraper.scrapers.adzuna_scraper import AdzunaScraper
from job_scraper.db.supabase_client import SupabaseClient

async def main():
    """
    Main function to run the Adzuna scraper and save enrichment data.
    """
    if "ADZUNA_APP_ID" not in os.environ or "ADZUNA_API_KEY" not in os.environ:
        print("Please set ADZUNA_APP_ID and ADZUNA_API_KEY environment variables.")
        return

    if "SUPABASE_URL" not in os.environ or "SUPABASE_SERVICE_ROLE_KEY" not in os.environ:
        print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
        return

    print("Initializing clients...")
    scraper = AdzunaScraper()
    db_client = SupabaseClient()

    print("Running Adzuna scraper to get jobs and enrichment data...")
    # We are not saving the jobs right now, just processing the company data
    jobs, company_data = await scraper.scrape(limit=50)

    print(f"\nFound {len(company_data)} pieces of company enrichment data to process.")

    if not company_data:
        print("No company data found to process.")
        return

    for company in company_data:
        print(f"  - Upserting data for company: {company['name']}")
        db_client.upsert_company(company)

    print("\nCompany enrichment process finished.")

if __name__ == '__main__':
    asyncio.run(main())
