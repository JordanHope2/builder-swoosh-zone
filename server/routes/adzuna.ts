import express from 'express';

const router = express.Router();

const ADZUNA_API_URL = 'https://api.adzuna.com/v1/api/jobs';

router.get('/search', async (req, res) => {
  const { what, where, country = 'ch' } = req.query; // Default country to Switzerland

  if (!what && !where) {
    return res.status(400).json({ error: 'At least one search parameter (what, where) is required.' });
  }

  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;

  if (!appId || !apiKey) {
    return res.status(500).json({ error: 'Adzuna API credentials are not configured on the server.' });
  }

  const searchParams = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: '20',
    what: what as string || '',
    where: where as string || '',
    country: country as string,
    content_type: 'application/json',
  });

  try {
    const adzunaRes = await fetch(`${ADZUNA_API_URL}/${country}/search/1?${searchParams.toString()}`);

    if (!adzunaRes.ok) {
        const errorData = await adzunaRes.text();
        throw new Error(`Adzuna API responded with status ${adzunaRes.status}: ${errorData}`);
    }

    const data = await adzunaRes.json();
    res.json(data);
  } catch (error: any) {
    console.error('Adzuna API error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs from Adzuna', details: error.message });
  }
});

export default router;
