import os
from typing import List, Dict
# from supabase import create_client, Client

class SupabaseClient:
    """
    A client for interacting with the Supabase database.
    """
    def __init__(self):
        # self.client: Client = create_client(
        #     os.environ.get("SUPABASE_URL"),
        #     os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        # )
        pass

    def upsert_jobs(self, jobs: List[Dict]):
        """
        Upserts a list of jobs to the Supabase database.
        """
        # for job in jobs:
        #     # Assuming 'hash' is the on_conflict column
        #     data, error = self.client.table('jobs').upsert(job, on_conflict='hash').execute()
        #     if error:
        #         print(f"Error upserting job {job.get('title')}: {error}")
        print(f"Upserting {len(jobs)} jobs to Supabase (not implemented yet).")
        pass
