import os
import requests
import sys
from typing import Dict, Any, List

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.db.supabase_client import SupabaseClient

class ZefixCompanyScraper:
    """
    A scraper for fetching company data from the Swiss Zefix Linked Data service
    using the SPARQL endpoint.
    """
    def __init__(self):
        self.db_client = SupabaseClient()
        self.sparql_endpoint = "https://lindas.admin.ch/query"

    def run(self, search_term: str, limit: int = 25):
        """
        Searches for a company using a SPARQL query and processes the results.
        """
        print(f"Searching Zefix for company: '{search_term}' using SPARQL")

        query = self._build_sparql_query(search_term, limit)
        headers = {
            'Accept': 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        try:
            response = requests.post(self.sparql_endpoint, data={'query': query}, headers=headers)
            response.raise_for_status()

            results = response.json()
            companies = self._parse_sparql_results(results)

            print(f"Found {len(companies)} companies.")
            for company in companies:
                print(f"  - Name: {company.get('name')}, UID: {company.get('zefix_uid')}, Type: {company.get('legal_entity_type')}")
                self.save_company(company)

        except requests.exceptions.RequestException as e:
            print(f"Error querying SPARQL endpoint: {e}")
            if e.response is not None:
                print("Status Code:", e.response.status_code)
                print("Response Text:", e.response.text)

    def _build_sparql_query(self, search_term: str, limit: int) -> str:
        # We search for the term in the lower-cased version of the company name.
        search_filter = f'FILTER(CONTAINS(LCASE(?name), "{search_term.lower()}"))'

        return f"""
            PREFIX schema: <http://schema.org/>
            PREFIX admin: <https://schema.ld.admin.ch/>

            SELECT ?company_uri ?name ?company_type ?municipality ?address ?locality
            WHERE {{
              ?company_uri a admin:ZefixOrganisation ;
                           schema:name ?name ;
                           schema:address ?addr .

              OPTIONAL {{ ?company_uri schema:additionalType ?type_id . ?type_id schema:name ?company_type . }}
              OPTIONAL {{ ?addr schema:streetAddress ?address . }}
              OPTIONAL {{ ?addr schema:addressLocality ?locality . }}
              OPTIONAL {{ ?addr admin:municipality ?muni_id . ?muni_id schema:name ?municipality . }}

              {search_filter}

              FILTER(langMatches(lang(?name), "de") || langMatches(lang(?name), "en") || langMatches(lang(?name), "fr") || langMatches(lang(?name), "it"))
            }}
            LIMIT {limit}
        """

    def _parse_sparql_results(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parses the JSON response from a SPARQL query, ensuring uniqueness by zefix_uid.
        """
        companies = []
        processed_uids = set()
        bindings = results.get('results', {}).get('bindings', [])

        for item in bindings:
            zefix_uid = item.get('company_uri', {}).get('value', '').split('/')[-1]
            if not zefix_uid or zefix_uid in processed_uids:
                continue

            company = {
                'zefix_uid': zefix_uid,
                'name': item.get('name', {}).get('value'),
                'legal_entity_type': item.get('company_type', {}).get('value'),
                'address': item.get('address', {}).get('value'),
                'location': item.get('locality', {}).get('value') or item.get('municipality', {}).get('value'),
                # Keep the raw data for logging
                'raw_data': item
            }
            companies.append(company)
            processed_uids.add(zefix_uid)

        return companies

    def save_company(self, company: Dict[str, Any]):
        """
        Upserts a company and its raw data to the database.
        """
        # The raw_data is part of the company dict, so we can pass it directly
        raw_data = company.get('raw_data', {})

        company_id = self.db_client.upsert_company(company)
        if company_id:
            self.db_client.log_raw_company_scrape(
                company_id=company_id,
                source='zefix',
                source_id=company['zefix_uid'],
                raw_data=raw_data
            )


if __name__ == '__main__':
    scraper = ZefixCompanyScraper()
    scraper.run(search_term="google")
    print("\n")
    scraper.run(search_term="ubique")
