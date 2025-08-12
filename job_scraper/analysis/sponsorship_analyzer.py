import sys
import os
import re

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient

# Define keywords that suggest visa sponsorship.
# Using regex patterns for more flexible matching (e.g., case-insensitivity).
SPONSORSHIP_KEYWORDS = [
    re.compile(r'visa\s(sponsorship|support)', re.IGNORECASE),
    re.compile(r'sponsorship\s(available|provided)', re.IGNORECASE),
    re.compile(r'work\spermit', re.IGNORECASE),
    re.compile(r'relocation\s(assistance|package|support)', re.IGNORECASE),
]

class SponsorshipAnalyzer:
    """
    Analyzes job descriptions to identify companies that may offer visa sponsorship.
    """
    def __init__(self):
        self.db_client = SupabaseClient()

    def analyze(self):
        """
        Fetches all jobs, analyzes their descriptions, and updates the company records.
        """
        print("Starting sponsorship analysis...")

        all_jobs = self.db_client.get_all_jobs_with_company()

        if not all_jobs:
            print("No jobs with linked companies found to analyze.")
            return

        companies_that_sponsor = set()

        for job in all_jobs:
            description = job.get('description', '')
            company_id = job.get('company_id')

            if not description or not company_id:
                continue

            for pattern in SPONSORSHIP_KEYWORDS:
                if pattern.search(description):
                    print(f"  - Found sponsorship keyword in job from company {company_id}.")
                    companies_that_sponsor.add(company_id)
                    # Move to the next job once a keyword is found
                    break

        print(f"\nFound {len(companies_that_sponsor)} companies that potentially offer sponsorship.")

        if not companies_that_sponsor:
            print("No companies found to update.")
            return

        for company_id in companies_that_sponsor:
            print(f"  - Updating company {company_id} to reflect sponsorship.")
            self.db_client.update_company_sponsorship(company_id, True)

        print("\nSponsorship analysis finished.")

if __name__ == '__main__':
    analyzer = SponsorshipAnalyzer()
    analyzer.analyze()
