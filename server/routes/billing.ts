import { Router } from "express";
import { Stripe } from "stripe";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";

const router = Router();

// Endpoint to get all active products and prices from Stripe
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });
    res.json(products.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the user's current subscription
router.get("/subscription", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["trialing", "active"])
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a Stripe Checkout session
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.id;
  if (!priceId) return res.status(400).json({ error: "priceId is required." });

  const supabase = getSupabaseAdmin();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  try {
    let { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = subscription?.stripe_customer_id;
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
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.VITE_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing?canceled=true`,
      metadata: { userId }
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a Stripe Billing Portal session
router.post("/create-portal-session", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();
    if (!subscription?.stripe_customer_id) return res.status(404).json({ error: "No active subscription found." });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.VITE_APP_URL}/dashboard/settings/billing`,
    });
    res.json({ url: portalSession.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
