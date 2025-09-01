import { Router } from 'express';
import { RequestHandler } from 'express';
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_API_KEY!,
});

const handleSearch: RequestHandler = async (req, res) => {
  const { q } = req.query;

  if (typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    const searchResult = await client.index('jobs').search(q);
    res.json(searchResult);
  } catch (error) {
    console.error('Meilisearch error:', error);
    res.status(500).json({ error: 'Failed to perform search.' });
  }
};

const router = Router();
router.get('/', handleSearch);

export default router;
