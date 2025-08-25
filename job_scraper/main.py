import os
import logging
import asyncio
from scrapers.jobup_scraper import main as jobup_main
from scrapers.adzuna_scraper import main as adzuna_main

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

async def run_all_scrapers():
    """
    Runs all available job scrapers.
    """
    logging.info("Starting all scrapers...")

    # Run Jobup scraper
    try:
        logging.info("--- Running Jobup Scraper ---")
        await jobup_main()
        logging.info("--- Jobup Scraper finished ---")
    except Exception as e:
        logging.error(f"Error running Jobup scraper: {e}", exc_info=True)

    # Run Adzuna scraper only if credentials are provided
    adzuna_app_id = os.getenv('ADZUNA_APP_ID')
    adzuna_api_key = os.getenv('ADZUNA_API_KEY')

    if adzuna_app_id and adzuna_api_key:
        try:
            logging.info("--- Running Adzuna Scraper ---")
            adzuna_main()
            logging.info("--- Adzuna Scraper finished ---")
        except Exception as e:
            logging.error(f"Error running Adzuna scraper: {e}", exc_info=True)
    else:
        logging.warning("Adzuna credentials not found. Skipping Adzuna scraper.")

    logging.info("All scrapers finished.")

if __name__ == "__main__":
    run_all_scrapers()
