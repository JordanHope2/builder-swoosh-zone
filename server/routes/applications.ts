import { Router } from 'express';
import { getSupabase, getSupabaseAdmin } from '../supabase';

const router = Router();

// Middleware to get the user from the JWT
const getUser = async (req, res, next) => {
  const supabase = getSupabase();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
};

// GET /api/applications/me - get the current user's applications
router.get('/me', getUser, async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*, companies(name))') // Also fetch related job and company info
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
