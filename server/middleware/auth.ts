import { Request, Response, NextFunction } from 'express';
import { getSupabase } from '../supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const supabase = getSupabase();
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Extend the Express Request type to include the user object
  // This can be done more formally in a .d.ts file, but this is a quick way
  (req as any).user = user;

  next();
};
