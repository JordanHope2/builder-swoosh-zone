import os
import logging
from scrapers.swissdevjobs_scraper import main as swissdev_main
from scrapers.adzuna_scraper import main as adzuna_main

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_all_scrapers():
    """
    Runs all available job scrapers.
    """
    logging.info("Starting all scrapers...")

    # Run SwissDevJobs scraper
    try:
        logging.info("--- Running SwissDevJobs Scraper ---")
        swissdev_main()
        logging.info("--- SwissDevJobs Scraper finished ---")
    except Exception as e:
        logging.error(f"Error running SwissDevJobs scraper: {e}", exc_info=True)

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
