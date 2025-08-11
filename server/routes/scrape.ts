import { Router } from 'express';
import 'dotenv/config';

const router = Router();

router.get('/', async (req, res) => {
  const { search, location, page = 1, limit = 20 } = req.query;

  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY) {
    return res.status(500).json({ error: 'Adzuna API credentials not configured.' });
  }

  try {
    const adzunaApiUrl = new URL(`https://api.adzuna.com/v1/api/jobs/ch/search/${page}`);
    adzunaApiUrl.searchParams.append('app_id', process.env.ADZUNA_APP_ID);
    adzunaApiUrl.searchParams.append('app_key', process.env.ADZUNA_API_KEY);
    adzunaApiUrl.searchParams.append('results_per_page', limit.toString());
    if (search) {
      adzunaApiUrl.searchParams.append('what', search as string);
    }
    if (location) {
      adzunaApiUrl.searchParams.append('where', location as string);
    }
    adzunaApiUrl.searchParams.append('content-type', 'application/json');

    const response = await fetch(adzunaApiUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from Adzuna', details: data });
    }

    res.json(data);
  } catch (error) {
    console.error('Error scraping from Adzuna:', error);
    res.status(500).json({ error: 'An unexpected error occurred while scraping.' });
  }
});

export default router;
