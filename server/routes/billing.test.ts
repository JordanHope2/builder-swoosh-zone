import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleStripeWebhook } from './billing';
import { getSupabaseAdmin } from '../supabase';
import { Request, Response } from 'express';

// Mock dependencies
vi.mock('../supabase');

// Use vi.hoisted to ensure our mock object is available to the vi.mock factory
const { mockStripe } = vi.hoisted(() => ({
  mockStripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    subscriptions: {
      retrieve: vi.fn(),
    },
  }
}));

vi.mock('stripe', () => ({
  default: vi.fn(() => mockStripe),
  Stripe: vi.fn(() => mockStripe),
}));


describe('handleStripeWebhook', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock = vi.fn();
  let sendMock = vi.fn();
  let jsonMock = vi.fn();

  // This is the robust, chainable mock for the Supabase client
  const mockSupabaseClient = {
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy_secret';

    // Setup mock response object with all required methods
    sendMock = vi.fn();
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({
      send: sendMock,
      json: jsonMock,
    }));
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    // Setup the deep, chainable Supabase mock
    const fromMock = {
        upsert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
        single: vi.fn().mockResolvedValue({ data: { user_id: 'user_xyz' }, error: null }),
    };
    fromMock.update.mockReturnValue({ eq: fromMock.eq });
    fromMock.select.mockReturnValue({ eq: vi.fn().mockReturnValue({ single: fromMock.single }) });
    mockSupabaseClient.from.mockReturnValue(fromMock);

    (getSupabaseAdmin as vi.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('should return 400 if signature is missing', async () => {
    mockRequest = { headers: {} };
    await handleStripeWebhook(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith('Webhook Error: Missing signature or secret.');
  });

  it('should handle checkout.session.completed correctly', async () => {
    const mockSession = {
      metadata: { userId: 'user_abc' },
      subscription: 'sub_123',
    };
    const mockSubscription = {
      customer: 'cus_123',
      items: { data: [{ price: { id: 'price_123' } }] },
      status: 'active',
      current_period_start: 1672531200,
      current_period_end: 1675209600,
      cancel_at_period_end: false,
    };
    const mockEvent = { type: 'checkout.session.completed', data: { object: mockSession } };

    mockRequest = { headers: { 'stripe-signature': 'sig_valid' }, body: {} };
    (mockStripe.webhooks.constructEvent as vi.Mock).mockReturnValue(mockEvent);
    (mockStripe.subscriptions.retrieve as vi.Mock).mockResolvedValue(mockSubscription);

    await handleStripeWebhook(mockRequest as Request, mockResponse as Response);

    const fromMock = mockSupabaseClient.from.mock.results[0].value;
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('subscriptions');
    expect(fromMock.upsert).toHaveBeenCalled();

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
    expect(fromMock.update).toHaveBeenCalledWith({ role: 'pro' });
    expect(jsonMock).toHaveBeenCalledWith({ received: true });
  });

  it('should handle customer.subscription.deleted correctly', async () => {
    const mockSubscription = {
      id: 'sub_456',
      status: 'canceled',
      items: { data: [{ price: { id: 'price_123' } }] },
    };
    const mockEvent = { type: 'customer.subscription.deleted', data: { object: mockSubscription } };

    mockRequest = { headers: { 'stripe-signature': 'sig_valid' }, body: {} };
    (mockStripe.webhooks.constructEvent as vi.Mock).mockReturnValue(mockEvent);

    await handleStripeWebhook(mockRequest as Request, mockResponse as Response);

    const fromMock = mockSupabaseClient.from.mock.results[0].value;
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('subscriptions');
    expect(fromMock.update).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
    expect(fromMock.update).toHaveBeenCalledWith({ role: 'free' });
    expect(jsonMock).toHaveBeenCalledWith({ received: true });
  });
});
