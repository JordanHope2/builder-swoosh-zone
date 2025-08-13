import { Router } from 'express';
import { getSupabaseAdmin } from '../supabase';

const router = Router();

router.get('/', async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
