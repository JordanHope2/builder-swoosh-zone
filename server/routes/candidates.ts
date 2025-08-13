import { Router } from 'express';
import { getSupabaseAdmin } from '../supabase';

const router = Router();

router.get('/', async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    // Note: The table name is `scraped_candidates` as per the schema files.
    const { data, error } = await supabase
      .from('scraped_candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
