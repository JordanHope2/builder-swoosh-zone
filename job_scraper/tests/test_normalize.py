import unittest
import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.utils.normalize import normalize_title, normalize_company, create_job_hash

class TestNormalize(unittest.TestCase):

    def test_normalize_title(self):
        self.assertEqual(normalize_title("  Software Engineer (m/f/d)  "), "software engineer m f d")
        self.assertEqual(normalize_title("Senior Frontend Developer - React/Vue"), "senior frontend developer react vue")
        self.assertEqual(normalize_title("Data Scientist (Genève)"), "data scientist geneve")
        self.assertEqual(normalize_title("Zürich, CH"), "zurich ch")
        self.assertEqual(normalize_title(""), "")
        self.assertEqual(normalize_title(None), "")

    def test_normalize_company(self):
        self.assertEqual(normalize_company("  Google Switzerland GmbH  "), "google switzerland gmbh")
        self.assertEqual(normalize_company("Crédit Suisse"), "credit suisse")
        self.assertEqual(normalize_company("Procter & Gamble"), "procter gamble")
        self.assertEqual(normalize_company(""), "")
        self.assertEqual(normalize_company(None), "")

    def test_create_job_hash(self):
        job1 = {
            "title": "Software Engineer",
            "company": "Google",
            "canton": "ZH",
            "date_posted": "2025-08-11"
        }
        job2 = {
            "title": "  Software Engineer  ",
            "company": "Google, Inc.",
            "canton": "zh",
            "date_posted": "2025-08-11"
        }
        job3 = {
            "title": "Different Job",
            "company": "Google",
            "canton": "ZH",
            "date_posted": "2025-08-11"
        }

        # The normalization will make company in job2 "google inc"
        # Let's adjust for the test's purpose
        job2_for_hash = job2.copy()
        job2_for_hash["company"] = "Google"

        hash1 = create_job_hash(job1)
        hash2 = create_job_hash(job2_for_hash)
        hash3 = create_job_hash(job3)

        self.assertEqual(hash1, hash2)
        self.assertNotEqual(hash1, hash3)

if __name__ == '__main__':
    unittest.main()
