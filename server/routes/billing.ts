// server/routes/billing.ts
import { Router, type Request, type Response } from "express";
import { Stripe } from "stripe";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";
import { CreateCheckoutSessionSchema } from "../validation/billingSchemas";
import {
  ProductListResponseSchema,
  StripeSubscriptionSchema,
} from "../validation/stripeSchemas";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const router = Router();

// Endpoint to get all active products and prices from Stripe
router.get("/products", authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  const validatedProducts = ProductListResponseSchema.parse(products.data);
  res.json(validatedProducts);
}));

// Endpoint to get the user's current subscription
router.get("/subscription", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["trialing", "active"])
    .single();

  if (error && error.code !== 'PGRST116') { // 'PGRST116' is "No rows found"
    throw error;
  }

  if (!data) {
    res.json(null);
    return;
  }

  const validatedSubscription = StripeSubscriptionSchema.parse(data);
  res.json(validatedSubscription);
}));

// Endpoint to create a Stripe Checkout session for a new subscription
router.post("/create-checkout-session", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const parsed = CreateCheckoutSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { priceId } = parsed.data;
  const userId = req.user.id;

  const supabase = getSupabaseAdmin();

  // Check if the user already has a Stripe customer ID
  const { data: subscription, error: subsError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (subsError && subsError.code !== 'PGRST116') { // 'PGRST116' is "No rows found"
    throw subsError;
  }

  let customerId = subscription?.stripe_customer_id;

  // If no customer ID exists, create a new Stripe customer
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer: customerId,
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: `${process.env.VITE_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.VITE_APP_URL}/pricing?canceled=true`,
    // We can pass metadata to the checkout session to identify the user
    // when we receive the `checkout.session.completed` webhook event.
    metadata: {
      userId,
    }
  });

  res.json({ url: session.url });
}));

// Endpoint to create a Stripe Billing Portal session for managing a subscription
router.post("/create-portal-session", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (error || !subscription?.stripe_customer_id) {
    res.status(404).json({ error: "No active subscription found for this user." });
    return;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.VITE_APP_URL}/dashboard/settings/billing`,
  });

  res.json({ url: portalSession.url });
}));


export default router;
