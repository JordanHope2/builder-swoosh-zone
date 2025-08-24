import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createServer } from "../index";

// Mock the auth middleware
vi.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: () => void) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  },
}));

// Mock the Stripe client constructor and its methods
const mockStripeInstance = {
  products: { list: vi.fn() },
  customers: { create: vi.fn() },
  checkout: { sessions: { create: vi.fn() } },
  billingPortal: { sessions: { create: vi.fn() } },
};

// Mock the 'stripe' module
vi.mock("stripe", () => {
  // A mock for the Stripe class constructor
  const MockStripe = vi.fn(() => mockStripeInstance);
  return {
    // This mocks the `import { Stripe } from "stripe"`
    Stripe: MockStripe,
    // This mocks the `import Stripe from "stripe"`
    default: MockStripe,
  };
});

// Mock the supabase client
const mockSupabaseClient = {
  from: vi.fn(),
};
vi.mock("../supabase", () => ({
  getSupabaseAdmin: () => mockSupabaseClient,
}));


describe("/api/billing", () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createServer();
  });

  describe("GET /products", () => {
    it("should return a list of stripe products", async () => {
      const mockProducts = { data: [{ id: "prod_1", name: "Pro Plan" }] };
      mockStripeInstance.products.list.mockResolvedValue(mockProducts);

      const response = await request(app).get("/api/billing/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts.data);
    });
  });

  describe("POST /create-checkout-session", () => {
    it("should create a checkout session and return a URL", async () => {
      const mockSession = { url: "https://stripe.com/checkout/session_123" };
      const mockCustomer = { id: "cus_123" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

      mockStripeInstance.customers.create.mockResolvedValue(mockCustomer);
      mockStripeInstance.checkout.sessions.create.mockResolvedValue(mockSession);

      const response = await request(app)
        .post("/api/billing/create-checkout-session")
        .send({ priceId: "price_123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ url: mockSession.url });
      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalled();
    });
  });

  describe("GET /subscription", () => {
    it("should return the user's subscription", async () => {
        const mockSubscription = { id: "sub_123", status: "active" };
        mockSupabaseClient.from.mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockSubscription, error: null }),
        });

        const response = await request(app).get("/api/billing/subscription");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSubscription);
    });
  });
});
