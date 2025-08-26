import os
import logging
from scrapers.swissdevjobs_scraper import main as swissdev_main
from scrapers.adzuna_scraper import main as adzuna_main
import asyncio

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

async def run_all_scrapers():
    """
    Runs all available job scrapers and writes a summary to a file.
    """
    logging.info("Starting all scrapers...")
    summary = []

    # Run SwissDevJobs scraper
    try:
        logging.info("--- Running SwissDevJobs Scraper ---")
        num_swissdev_jobs = await swissdev_main()
        summary.append(f"SwissDevJobs: Scraped {num_swissdev_jobs} jobs.")
        logging.info("--- SwissDevJobs Scraper finished ---")
    except Exception as e:
        summary.append("SwissDevJobs: Failed to run.")
        logging.error(f"Error running SwissDevJobs scraper: {e}", exc_info=True)

    # Run Adzuna scraper only if credentials are provided
    adzuna_app_id = os.getenv('ADZUNA_APP_ID')
    adzuna_api_key = os.getenv('ADZUNA_API_KEY')

    if adzuna_app_id and adzuna_api_key:
        try:
            logging.info("--- Running Adzuna Scraper ---")
            num_adzuna_jobs = await adzuna_main()
            summary.append(f"Adzuna: Scraped {num_adzuna_jobs} jobs.")
            logging.info("--- Adzuna Scraper finished ---")
        except Exception as e:
            summary.append("Adzuna: Failed to run.")
            logging.error(f"Error running Adzuna scraper: {e}", exc_info=True)
    else:
        summary.append("Adzuna: Skipped (credentials not found).")
        logging.warning("Adzuna credentials not found. Skipping Adzuna scraper.")

    logging.info("All scrapers finished.")

    # Write summary to file
    with open("scraper-summary.txt", "w") as f:
        f.write("\n".join(summary))
    logging.info("Scraper summary written to scraper-summary.txt")

if __name__ == "__main__":
    asyncio.run(run_all_scrapers())
