from abc import ABC, abstractmethod
from typing import List, Dict

class BaseScraper(ABC):
    """
    Abstract base class for all job scrapers.
    """

    @abstractmethod
    async def scrape(self) -> List[Dict]:
        """
        Scrapes job data from a source and returns a list of job dictionaries.
        """
        pass
