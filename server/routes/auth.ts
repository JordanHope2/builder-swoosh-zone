import { Router } from 'express';
import { z } from 'zod';
import { publishToQueue } from '../mq';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userData: z.any().optional(),
});

router.post('/signup', async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, password, userData } = parsed.data;

    const message = JSON.stringify({ email, password, userData });
    await publishToQueue('signup', message);

    res.status(202).json({ message: 'Signup request received. You will receive a confirmation email shortly.' });
  } catch (error) {
    console.error('Signup API error:', error);
    res.status(500).json({ error: 'Failed to process signup request.' });
  }
});

export default router;
