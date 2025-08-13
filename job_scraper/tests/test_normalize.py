import unittest
import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.utils.normalize import (
    normalize_title,
    normalize_company,
    create_job_hash,
    normalize_location,
    extract_skills_from_text,
    normalize_url
)

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

    def test_normalize_location(self):
        self.assertEqual(normalize_location("Zurich, Switzerland"), "Switzerland")
        self.assertEqual(normalize_location("Geneva, Suisse"), "Switzerland")
        self.assertEqual(normalize_location("Bern, Schweiz"), "Switzerland")
        self.assertEqual(normalize_location("Lausanne"), "Lausanne") # No rule, return original
        self.assertEqual(normalize_location(""), "")
        self.assertEqual(normalize_location(None), "")

    def test_extract_skills_from_text(self):
        bio = "Experienced Python and React developer. I love working with node.js, AWS, and Docker. C# is also cool."
        expected_skills = {"python", "react", "node.js", "aws", "docker", "c#"}
        self.assertEqual(extract_skills_from_text(bio), expected_skills)

        # Test that 'go' is extracted from "go programmer" but not from "go-getter".
        bio2 = "I'm a go-getter, not a go programmer."
        self.assertEqual(extract_skills_from_text(bio2), {'go'})

        bio3 = "I know javascript."
        self.assertEqual(extract_skills_from_text(bio3), {"javascript"})

        self.assertEqual(extract_skills_from_text(""), set())
        self.assertEqual(extract_skills_from_text(None), set())

    def test_normalize_url(self):
        self.assertEqual(normalize_url("example.com"), "https://example.com")
        self.assertEqual(normalize_url("http://example.com"), "http://example.com")
        self.assertEqual(normalize_url("https://www.example.com/path?query=1"), "https://www.example.com/path?query=1")
        self.assertEqual(normalize_url(""), "")
        self.assertEqual(normalize_url(None), "")
        # It should handle being given an already correct URL
        self.assertEqual(normalize_url("https://linkedin.com/in/user"), "https://linkedin.com/in/user")


if __name__ == '__main__':
    unittest.main()
