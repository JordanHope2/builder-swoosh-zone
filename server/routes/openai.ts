import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    res.json(completion.choices[0]);
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
  }
});

export default router;
