import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supa';

export default async function health(req: Request, res: Response) {
  const db = await supabaseAdmin.from('jobs').select('id').limit(1);
  const ok = db.status === 200 || db.status === 206;
  res.status(ok ? 200 : 500).json({ db: ok ? 'ok' : 'err', time: new Date().toISOString() });
}
