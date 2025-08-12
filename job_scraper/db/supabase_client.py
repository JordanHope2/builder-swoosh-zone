import os
from typing import List, Dict, Set, Any
from supabase import create_client, Client

class SupabaseClient:
    """
    A client for interacting with the Supabase database.
    """
    def __init__(self):
        self.client: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        )

    def upsert_jobs(self, jobs: List[Dict]):
        """
        Upserts a list of jobs to the Supabase database.
        """
        if not jobs:
            return

        try:
            # Assuming 'hash' is the on_conflict column
            data, count = self.client.table('jobs').upsert(
                jobs,
                on_conflict='hash'
            ).execute()
            print(f"Successfully upserted {len(data[1])} jobs.")
        except Exception as e:
            print(f"An error occurred while upserting jobs: {e}")

    def upsert_candidate(self, candidate: Dict[str, Any]) -> int | None:
        """
        Upserts a single candidate profile to the `scraped_candidates` table.
        Returns the ID of the upserted record.
        """
        if not candidate:
            return None

        try:
            data, count = self.client.table('scraped_candidates').upsert(
                candidate,
                on_conflict='source,source_id'
            ).execute()

            if data and data[1]:
                candidate_id = data[1][0]['id']
                print(f"Upserted candidate {candidate['username']}. ID: {candidate_id}")
                return candidate_id
            return None
        except Exception as e:
            print(f"An error occurred while upserting candidate {candidate.get('username')}: {e}")
            return None

    def upsert_candidate_skills(self, candidate_id: int, skills: Set[str]):
        """
        Upserts a set of skills for a given candidate to the `scraped_candidate_skills` table.
        """
        if not skills or not candidate_id:
            return

        skill_records = [
            # Note: the column name in the table is 'source_of_skill'
            {"candidate_id": candidate_id, "skill": skill, "source_of_skill": "bio_keyword"} for skill in skills
        ]

        try:
            data, count = self.client.table('scraped_candidate_skills').upsert(
                skill_records,
                on_conflict='candidate_id,skill',
                ignore_duplicates=True
            ).execute()
            print(f"Upserted {len(data[1])} skills for candidate ID {candidate_id}.")
        except Exception as e:
            print(f"An error occurred while upserting skills for candidate ID {candidate_id}: {e}")
