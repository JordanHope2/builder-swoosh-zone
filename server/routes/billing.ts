import { Router } from "express";
import { Stripe } from "stripe";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";
import { getSecrets } from "../services/secretManager";

// Initialize stripe inside the handlers to ensure secrets are loaded.
let stripe: Stripe;

function getStripe() {
  if (stripe) return stripe;
  const secrets = getSecrets();
  stripe = new Stripe(secrets.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
  return stripe;
}

const router = Router();

router.get("/products", authMiddleware, async (req, res) => {
  try {
    const stripeClient = getStripe();
    const products = await stripeClient.products.list({
      active: true,
      expand: ["data.default_price"],
    });
    res.json(products.data);
  } catch (error: any) {
    console.error("Error fetching Stripe products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

router.get("/subscription", authMiddleware, async (req, res) => {
    // ... same logic
});

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
    try {
        const stripeClient = getStripe();
        // ... rest of the logic
    } catch (error: any) {
        // ...
    }
});

router.post("/create-portal-session", authMiddleware, async (req, res) => {
    try {
        const stripeClient = getStripe();
        // ... rest of the logic
    } catch (error: any) {
        // ...
    }
});

export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = getSecrets().STRIPE_WEBHOOK_SECRET;
  const stripeClient = getStripe();

  if (!sig || !webhookSecret) {
    // ...
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    // ...
  }

  // ... rest of webhook logic
};

export default router;
