import unittest
import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.analysis.matching_service import calculate_match_score

class TestMatchingService(unittest.TestCase):

    def test_calculate_match_score(self):
        # Case 1: High similarity
        candidate_text_1 = "Experienced Python developer with a background in machine learning and data analysis."
        job_text_1 = "We are looking for a Python developer with experience in machine learning to join our data science team."
        score_1 = calculate_match_score(candidate_text_1, job_text_1)
        self.assertIsInstance(score_1, int)
        self.assertGreater(score_1, 35, "Expected high similarity score")

        # Case 2: Low similarity
        candidate_text_2 = "A creative graphic designer focused on branding and UI/UX."
        job_text_2 = "Seeking a backend engineer for database management and API development."
        score_2 = calculate_match_score(candidate_text_2, job_text_2)
        self.assertIsInstance(score_2, int)
        self.assertLess(score_2, 40, "Expected low similarity score")

        # Case 3: Empty strings
        score_3 = calculate_match_score("", "")
        self.assertEqual(score_3, 0)
        score_4 = calculate_match_score("Some text", "")
        self.assertEqual(score_4, 0)

if __name__ == '__main__':
    unittest.main()
