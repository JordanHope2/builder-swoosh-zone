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

    def upsert_company(self, company: Dict[str, Any]) -> str | None:
        """
        Upserts a canonical company profile based on its Zefix UID.
        Returns the UUID of the upserted record.
        """
        if not company or not company.get('zefix_uid'):
            return None

        try:
            # We only insert the fields that are part of the 'companies' table schema
            company_data = {
                'zefix_uid': company.get('zefix_uid'),
                'name': company.get('name'),
                'legal_entity_type': company.get('legal_entity_type'),
                'address': company.get('address'),
                'location': company.get('location')
            }

            data, count = self.client.table('companies').upsert(
                company_data,
                on_conflict='zefix_uid'
            ).execute()

            if data and data[1]:
                company_id = data[1][0]['id']
                print(f"Upserted company {company['name']}. ID: {company_id}")
                return company_id
            return None
        except Exception as e:
            print(f"An error occurred while upserting company {company.get('name')}: {e}")
            return None

    def log_raw_company_scrape(self, company_id: str, source: str, source_id: str, raw_data: Dict[str, Any]):
        """
        Logs the raw scraped data for a company to the `companies_scraped_raw_data` table.
        """
        if not all([company_id, source, source_id, raw_data]):
            return

        log_entry = {
            'company_id': company_id,
            'source': source,
            'source_id': source_id,
            'raw_data': raw_data
        }

        try:
            data, count = self.client.table('companies_scraped_raw_data').insert(log_entry).execute()
            print(f"Logged raw scrape for company ID {company_id} from source {source}.")
        except Exception as e:
            print(f"An error occurred while logging raw company scrape: {e}")

    def get_jobs_without_company_link(self) -> List[Dict[str, Any]]:
        """
        Fetches all jobs that do not have a company_id assigned yet.
        """
        try:
            # The correct way to filter for NULL is to use the value `None`.
            response = self.client.table('jobs').select('id, company_name').is_('company_id', None).execute()
            print(f"Found {len(response.data)} jobs without a company link.")
            return response.data
        except Exception as e:
            print(f"An error occurred while fetching jobs without company link: {e}")
            return []

    def get_all_companies(self) -> List[Dict[str, Any]]:
        """
        Fetches all companies from the canonical companies table.
        """
        try:
            response = self.client.table('companies').select('id, name').execute()
            print(f"Found {len(response.data)} canonical companies.")
            return response.data
        except Exception as e:
            print(f"An error occurred while fetching all companies: {e}")
            return []

    def update_job_company_link(self, job_id: str, company_id: str):
        """
        Updates a job record to link it to a company.
        """
        try:
            self.client.table('jobs').update({'company_id': company_id}).eq('id', job_id).execute()
            print(f"Successfully linked job {job_id} to company {company_id}.")
        except Exception as e:
            print(f"An error occurred while updating job {job_id}: {e}")
