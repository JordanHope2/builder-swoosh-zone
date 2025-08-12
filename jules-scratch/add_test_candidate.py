import os
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from job_scraper.db.supabase_client import SupabaseClient

def add_test_candidate():
    """
    Adds a single test candidate to the database for demonstration purposes.
    """
    print("Connecting to Supabase to add a test candidate...")
    db_client = SupabaseClient()

    test_candidate = {
        "source": "manual_test",
        "source_id": "test-candidate-123",
        "username": "test_candidate",
        "name": "Test Candidate",
        "email": "test@example.com",
        "location": "Zurich, Switzerland",
        "company": "Test Inc.",
        "bio": "A skilled developer with experience in Python, React, and cloud services. Looking for new opportunities.",
        "github_url": "https://github.com/test_candidate"
    }

    print(f"Upserting test candidate: {test_candidate['name']}")
    candidate_id = db_client.upsert_candidate(test_candidate)

    if candidate_id:
        print(f"Successfully added/updated test candidate with ID: {candidate_id}")
    else:
        print("Failed to add test candidate.")

if __name__ == '__main__':
    add_test_candidate()
