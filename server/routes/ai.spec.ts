import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';
import OpenAI from 'openai';

// Mock the OpenAI API
vi.mock('openai', () => {
  const mockOpenAI = {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'This is a mock AI response.' } }],
        }),
      },
    },
  };
  return {
    __esModule: true,
    default: vi.fn(() => mockOpenAI),
  };
});

describe('POST /api/ai/chat', () => {
  const app = createServer();

  it('should return a mock AI response', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hello, AI!' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ reply: 'This is a mock AI response.' });
  });

  it('should return a 400 error if message is not provided', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Message is required' });
  });
});
