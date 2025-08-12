import sys
import os
from thefuzz import process

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient

class CompanyLinker:
    """
    A utility to link jobs to canonical companies using fuzzy name matching.
    """
    def __init__(self, match_threshold: int = 85):
        self.db_client = SupabaseClient()
        self.match_threshold = match_threshold

    def run(self):
        """
        Executes the linking process.
        """
        print("Starting company linking process...")

        # 1. Fetch data
        jobs_to_link = self.db_client.get_jobs_without_company_link()
        all_companies = self.db_client.get_all_companies()

        if not jobs_to_link or not all_companies:
            print("No jobs to link or no canonical companies found. Exiting.")
            return

        # Create a dictionary for easy lookup of company names for matching
        company_choices = {company['name']: company['id'] for company in all_companies}

        # 2. Match and update
        linked_count = 0
        for job in jobs_to_link:
            job_id = job.get('id')
            job_company_name = job.get('company_name')

            if not job_company_name:
                continue

            # Find the best match using fuzzy string matching
            best_match = process.extractOne(job_company_name, company_choices.keys())

            if best_match and best_match[1] >= self.match_threshold:
                matched_name = best_match[0]
                matched_id = company_choices[matched_name]
                match_score = best_match[1]

                print(f"  - Match found for '{job_company_name}': '{matched_name}' (Score: {match_score})")
                self.db_client.update_job_company_link(job_id, matched_id)
                linked_count += 1
            else:
                print(f"  - No high-confidence match found for '{job_company_name}'.")

        print(f"\nCompany linking process finished. {linked_count} jobs were linked.")

if __name__ == '__main__':
    linker = CompanyLinker(match_threshold=85)
    linker.run()
