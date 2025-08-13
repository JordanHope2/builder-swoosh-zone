import sys
import os
import re
from typing import List, Dict, Set

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient

# --- Keyword Definitions for Tagging ---

INDUSTRY_KEYWORDS: Dict[str, List[str]] = {
    'fintech': ['fintech', 'financial services', 'banking', 'investment', 'insurance'],
    'healthtech': ['healthtech', 'medical', 'pharma', 'biotech', 'healthcare'],
    'e-commerce': ['e-commerce', 'ecommerce', 'retail', 'shopping'],
    'saas': ['saas', 'software as a service'],
    'ai': ['artificial intelligence', 'machine learning', 'ai', 'ml'],
}

CULTURE_KEYWORDS: Dict[str, List[str]] = {
    'fast-paced': ['fast-paced', 'dynamic environment'],
    'work-life balance': ['work-life balance', 'flexible hours', 'hybrid work'],
    'learning': ['continuous learning', 'professional development', 'growth opportunity'],
    'collaborative': ['collaborative', 'team-oriented', 'team player'],
    'innovative': ['innovative', 'cutting-edge', 'state-of-the-art'],
}


class NLPTagger:
    """
    Analyzes company descriptions to generate descriptive tags.
    """
    def __init__(self):
        self.db_client = SupabaseClient()
        self.tag_dictionaries = {
            'industry': INDUSTRY_KEYWORDS,
            'culture': CULTURE_KEYWORDS
        }

    def generate_tags(self, description: str) -> Set[str]:
        """
        Generates a set of tags from a piece of text based on predefined keywords.
        """
        if not description:
            return set()

        found_tags = set()
        text_lower = description.lower()

        for category, keywords in self.tag_dictionaries.items():
            for tag, patterns in keywords.items():
                for pattern in patterns:
                    # Using simple 'in' for now, can be upgraded to regex for whole words
                    if pattern in text_lower:
                        found_tags.add(tag)
                        # Once a tag is found for a category, we could break
                        # to avoid multiple tags from the same keyword list,
                        # but for now, let's be inclusive.

        return found_tags

    def run(self):
        """
        Fetches companies, generates tags, and updates the database.
        """
        print("Starting NLP tagging process...")

        companies_to_tag = self.db_client.get_companies_for_tagging()

        if not companies_to_tag:
            print("No companies with descriptions found to tag.")
            return

        for company in companies_to_tag:
            company_id = company.get('id')
            description = company.get('description')

            tags = self.generate_tags(description)

            if tags:
                print(f"  - Company {company_id}: Generated tags -> {tags}")
                self.db_client.update_company_tags(company_id, list(tags))
            else:
                print(f"  - Company {company_id}: No tags generated.")

        print("\nNLP tagging process finished.")

if __name__ == '__main__':
    tagger = NLPTagger()
    tagger.run()
