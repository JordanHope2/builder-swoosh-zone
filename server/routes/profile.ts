import { Router } from 'express';
import { getSupabase, getSupabaseAdmin } from '../supabase';

const router = Router();

// Middleware to get the user from the JWT
const getUser = async (req, res, next) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
};

// GET /api/profile/me - get the current user's profile
router.get('/me', getUser, async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      // This can happen if the profile hasn't been created yet after sign up
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Profile not found.' });
      }
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
