from typing import Dict
# from job_scraper.db.supabase_client import SupabaseClient

def log_run(stats: Dict):
    """
    Logs the statistics of a scraper run to the Supabase database.
    """
    # client = SupabaseClient()
    # data, error = client.client.table('scraper_runs').insert(stats).execute()
    # if error:
    #     print(f"Error logging scraper run: {error}")
    print("Logging scraper run (not implemented yet):")
    print(stats)
    pass
