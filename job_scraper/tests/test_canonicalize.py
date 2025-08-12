import unittest
import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from job_scraper.dedupe.canonicalize import are_titles_similar

class TestCanonicalize(unittest.TestCase):

    def test_are_titles_similar(self):
        self.assertTrue(are_titles_similar("Software Engineer", "Software Engineer"))
        self.assertTrue(are_titles_similar("Software Engineer", "  Software Engineer  "))
        self.assertTrue(are_titles_similar("Software Engineer", "software engineer"))
        self.assertTrue(are_titles_similar("Sr. Software Engineer", "Senior Software Engineer"))
        self.assertFalse(are_titles_similar("Software Engineer", "Project Manager"))
        self.assertFalse(are_titles_similar("Software Engineer", "Data Scientist"))

if __name__ == '__main__':
    unittest.main()
