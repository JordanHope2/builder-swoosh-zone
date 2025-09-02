import { Router } from "express";
import { Stripe } from "stripe";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const router = Router();

// Endpoint to get all active products and prices from Stripe
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    res.json(products.data);
  } catch (error: any) {
    console.error("Error fetching Stripe products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
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

    if (error && error.code !== 'PGRST116') { // 'PGRST116' is "No rows found"
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({ error: "Failed to fetch subscription details." });
  }
});

// Endpoint to create a Stripe Checkout session for a new subscription
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.id;

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required." });
  }

  const supabase = getSupabaseAdmin();

  try {
    // Check if the user already has a Stripe customer ID
    let { data: subscription, error: subsError } = await supabase
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
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

// Endpoint to create a Stripe Billing Portal session for managing a subscription
router.post("/create-portal-session", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();

  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      return res.status(404).json({ error: "No active subscription found for this user." });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.VITE_APP_URL}/dashboard/settings/billing`,
    });

    res.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Error creating Stripe portal session:", error);
    res.status(500).json({ error: "Failed to create portal session." });
  }
});

// This function is extracted from server/index.ts to be more modular and testable.
export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("Stripe webhook signature or secret is missing.");
    return res.status(400).send("Webhook Error: Missing signature or secret.");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supabase = getSupabaseAdmin();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription;

      if (!userId || typeof subscriptionId !== 'string') {
        console.error("Webhook Error: Missing userId or subscriptionId in checkout session.");
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Save subscription data to our database
      const { error } = await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
      });

      if (error) {
        console.error("Error saving subscription to DB:", error);
        break;
      }

      // Update user role
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "pro" })
        .eq("id", userId);

      if (roleError) {
        console.error("Error updating user role:", roleError);
      }

      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabase
            .from("subscriptions")
            .update({
                status: subscription.status,
                stripe_price_id: subscription.items.data[0].price.id,
                cancel_at_period_end: subscription.cancel_at_period_end,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
            })
            .eq("stripe_subscription_id", subscription.id);

        if (error) {
            console.error("Error updating subscription in DB:", error);
            break;
        }

        // If subscription is no longer active, downgrade user role
        if (subscription.status !== 'active' && subscription.status !== 'trialing') {
            const { data: subData, error: subSelectError } = await supabase
                .from("subscriptions")
                .select("user_id")
                .eq("stripe_subscription_id", subscription.id)
                .single();

            if (subSelectError) {
                console.error("Error fetching user for role downgrade:", subSelectError);
                break;
            }

            const { error: roleError } = await supabase
                .from("profiles")
                .update({ role: "free" })
                .eq("id", subData.user_id);

            if (roleError) {
                console.error("Error downgrading user role:", roleError);
            }
        }
        break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export default router;
