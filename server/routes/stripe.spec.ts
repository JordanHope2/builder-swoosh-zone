// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';
import Stripe from 'stripe';

// Mock the Stripe API
vi.mock('stripe', () => {
  const mockStripe = {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/pay/cs_test_123',
        }),
      },
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  };
  return {
    __esModule: true,
    default: vi.fn(() => mockStripe),
  };
});

describe('Stripe API Endpoints', () => {
  const app = createServer();

  describe('POST /api/stripe/create-checkout-session', () => {
    it('should return a Stripe checkout session URL', async () => {
      const response = await request(app)
        .post('/api/stripe/create-checkout-session')
        .send({ priceId: 'price_123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      });
    });

    it('should return a 400 error if priceId is not provided', async () => {
      const response = await request(app)
        .post('/api/stripe/create-checkout-session')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Price ID is required' });
    });
  });

  describe('POST /api/stripe/webhook', () => {
    it('should return a 200 and received: true for a valid webhook', async () => {
      const mockEvent = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
          },
        },
      };

      // Mock the constructEvent function to return the mock event
      const stripe = new Stripe('');
      (stripe.webhooks.constructEvent as vi.Mock).mockReturnValue(mockEvent);

      const response = await request(app)
        .post('/api/stripe/webhook')
        .set('stripe-signature', 't=123,v1=123,v0=123') // A dummy signature
        .send(Buffer.from(JSON.stringify(mockEvent))) // Send a buffer
        .type('json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });

    it('should return a 400 error for an invalid webhook signature', async () => {
      // Mock the constructEvent function to throw an error
      const stripe = new Stripe('');
      (stripe.webhooks.constructEvent as vi.Mock).mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await request(app)
        .post('/api/stripe/webhook')
        .set('stripe-signature', 'invalid_signature')
        .send(Buffer.from(JSON.stringify({ id: 'evt_123' }))) // Send a buffer
        .type('json');

      expect(response.status).toBe(400);
      expect(response.text).toContain('Webhook Error: Invalid signature');
    });
  });
});
