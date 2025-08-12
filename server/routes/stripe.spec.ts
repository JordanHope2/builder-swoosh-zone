// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';
import Stripe from 'stripe';

// Hoist the mock functions
const mockUpsert = vi.fn();
const mockSelect = vi.fn();

vi.mock('../lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      upsert: mockUpsert,
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockSelect,
        })),
      })),
    })),
  },
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/stripe/create-checkout-session', () => {
    it('should return a Stripe checkout session URL', async () => {
      const response = await request(app)
        .post('/api/stripe/create-checkout-session')
        .set('x-mock-user-id', 'user_123')
        .send({ priceId: 'price_123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/stripe/create-checkout-session')
        .send({ priceId: 'price_123' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/stripe/subscription', () => {
    it('should return the user subscription', async () => {
      const mockSubscription = {
        user_id: 'user_123',
        status: 'active',
      };
      mockSelect.mockResolvedValue({ data: mockSubscription, error: null });

      const response = await request(app)
        .get('/api/stripe/subscription')
        .set('x-mock-user-id', 'user_123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ subscription: mockSubscription });
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).get('/api/stripe/subscription');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/stripe/webhook', () => {
    it('should call the upsert function with the correct data', async () => {
      mockUpsert.mockResolvedValue({ error: null });
      const mockEvent = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            client_reference_id: 'user_123',
            subscription: 'sub_123',
          },
        },
      };

      const stripe = new Stripe('');
      (stripe.webhooks.constructEvent as vi.Mock).mockReturnValue(mockEvent);

      await request(app)
        .post('/api/stripe/webhook')
        .set('stripe-signature', 't=123,v1=123,v0=123')
        .send(Buffer.from(JSON.stringify(mockEvent)))
        .type('json');

      expect(mockUpsert).toHaveBeenCalledWith({
        user_id: 'user_123',
        stripe_subscription_id: 'sub_123',
        status: 'active',
      }, { onConflict: 'user_id' });
    });

    it('should return a 200 and received: true for a valid webhook', async () => {
      mockUpsert.mockResolvedValue({ error: null });
      const mockEvent = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            client_reference_id: 'user_123',
            subscription: 'sub_123',
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
