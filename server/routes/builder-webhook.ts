import type { Request, Response } from 'express';
export default async function builderWebhook(req: Request, res: Response) {
  const sig = req.headers['x-builder-signature'];
  if (sig !== process.env.BUILDER_WEBHOOK_SECRET) return res.status(401).send('bad sig');
  // TODO: kick cache purge or CI webhook if needed
  res.status(200).send('ok');
}
