import os
import json
from typing import List, Dict, Set, Any
from dotenv import load_dotenv
from supabase import create_client, Client
import os

# Construct a path to the .env file in the project root
dotenv_path = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path=dotenv_path)

class SupabaseClient:
    """
    A client for interacting with the Supabase database.
    In "dry run" mode (when SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set),
    it prints the data that would be sent to the database instead of making a real call.
    """
    def __init__(self):
        self.client: Client | None = None
        self.dry_run = False

        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

        if supabase_url and supabase_key:
            self.client = create_client(supabase_url, supabase_key)
        else:
            self.dry_run = True
            print("--- SUPABASE DRY RUN MODE ---")
            print("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found.")
            print("Database operations will be printed instead of executed.")
            print("-----------------------------")


    def upsert_jobs(self, jobs: List[Dict]):
        """
        Upserts a list of jobs to the Supabase database.
        """
        if not jobs:
            return

        if self.dry_run or not self.client:
            print("[DRY RUN] Would upsert jobs:")
            print(json.dumps(jobs, indent=2))
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

        if self.dry_run or not self.client:
            print("[DRY RUN] Would upsert candidate:")
            print(json.dumps(candidate, indent=2))
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
            {"candidate_id": candidate_id, "skill": skill, "source_of_skill": "bio_keyword"} for skill in skills
        ]

        if self.dry_run or not self.client:
            print(f"[DRY RUN] Would upsert {len(skill_records)} skills for candidate ID {candidate_id}:")
            print(json.dumps(skill_records, indent=2))
            return

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
        Upserts a company profile.
        """
        if not company or not company.get('name'):
            return None

        if self.dry_run or not self.client:
            print("[DRY RUN] Would upsert company:")
            print(json.dumps(company, indent=2))
            return None

        # Case 1: We have a Zefix UID (from Zefix scraper)
        if 'zefix_uid' in company and company['zefix_uid']:
            company_data = {
                'zefix_uid': company.get('zefix_uid'),
                'name': company.get('name'),
                'legal_entity_type': company.get('legal_entity_type'),
                'address': company.get('address'),
                'location': company.get('location')
            }
            try:
                data, count = self.client.table('companies').upsert(company_data, on_conflict='zefix_uid').execute()
                if data and data[1]:
                    company_id = data[1][0]['id']
                    print(f"(Zefix) Upserted company {company['name']}. ID: {company_id}")
                    return company_id
                return None
            except Exception as e:
                print(f"An error occurred while upserting Zefix company {company.get('name')}: {e}")
                return None

        # Case 2: No Zefix UID (from Adzuna enrichment)
        else:
            enrichment_data = {
                'name': company.get('name'),
                'description': company.get('description'),
                'tech_stack': company.get('tech_stack')
            }
            try:
                data, count = self.client.table('companies').upsert(enrichment_data, on_conflict='name').execute()
                if data and data[1]:
                    company_id = data[1][0]['id']
                    print(f"(Enrichment) Upserted company {company['name']}. ID: {company_id}")
                    return company_id
                return None
            except Exception as e:
                print(f"An error occurred while upserting enrichment data for company {company.get('name')}: {e}")
                return None

    def log_raw_company_scrape(self, company_id: str, source: str, source_id: str, raw_data: Dict[str, Any]):
        """
        Logs the raw scraped data for a company to the `companies_scraped_raw_data` table.
        """
        if not all([company_id, source, source_id, raw_data]):
            return

        if self.dry_run or not self.client:
            print("[DRY RUN] Would log raw company scrape:")
            print(json.dumps({'company_id': company_id, 'source': source, 'source_id': source_id}, indent=2))
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
        if self.dry_run or not self.client:
            print("[DRY RUN] Would get jobs without company link. Returning empty list.")
            return []
        try:
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
        if self.dry_run or not self.client:
            print("[DRY RUN] Would get all companies. Returning empty list.")
            return []
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
        if self.dry_run or not self.client:
            print(f"[DRY RUN] Would link job {job_id} to company {company_id}.")
            return
        try:
            self.client.table('jobs').update({'company_id': company_id}).eq('id', job_id).execute()
            print(f"Successfully linked job {job_id} to company {company_id}.")
        except Exception as e:
            print(f"An error occurred while updating job {job_id}: {e}")

    def get_all_jobs_with_company(self) -> List[Dict[str, Any]]:
        """
        Fetches all jobs that have a valid, linked company_id.
        """
        if self.dry_run or not self.client:
            print("[DRY RUN] Would get all jobs with company. Returning empty list.")
            return []
        try:
            response = self.client.table('jobs').select('company_id, description').not_.is_('company_id', None).execute()
            print(f"Found {len(response.data)} jobs with a linked company to analyze.")
            return response.data
        except Exception as e:
            print(f"An error occurred while fetching jobs with company links: {e}")
            return []

    def update_company_sponsorship(self, company_id: str, status: bool):
        """
        Updates the sponsorship status for a company.
        """
        if self.dry_run or not self.client:
            print(f"[DRY RUN] Would update sponsorship for company {company_id} to {status}.")
            return
        try:
            self.client.table('companies').update({'offers_visa_sponsorship': status}).eq('id', company_id).execute()
            print(f"Successfully updated sponsorship status for company {company_id}.")
        except Exception as e:
            print(f"An error occurred while updating sponsorship for company {company_id}: {e}")

    def get_companies_for_tagging(self) -> List[Dict[str, Any]]:
        """
        Fetches companies that have a description but have not yet been tagged.
        """
        if self.dry_run or not self.client:
            print("[DRY RUN] Would get companies for tagging. Returning empty list.")
            return []
        try:
            response = self.client.table('companies').select('id, description').not_.is_('description', None).is_('tags', None).execute()
            print(f"Found {len(response.data)} companies to tag.")
            return response.data
        except Exception as e:
            print(f"An error occurred while fetching companies for tagging: {e}")
            return []

    def update_company_tags(self, company_id: str, tags: List[str]):
        """
        Updates the tags for a specific company.
        """
        if not tags:
            return
        if self.dry_run or not self.client:
            print(f"[DRY RUN] Would update tags for company {company_id}:")
            print(json.dumps(tags, indent=2))
            return
        try:
            self.client.table('companies').update({'tags': tags}).eq('id', company_id).execute()
            print(f"Successfully updated tags for company {company_id}.")
        except Exception as e:
            print(f"An error occurred while updating tags for company {company_id}: {e}")
