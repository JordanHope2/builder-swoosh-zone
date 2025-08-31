// server/index.ts
import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import jobsRouter from "./routes/jobs";
import scrapeRouter from "./routes/scrape";
import uploadRouter from "./routes/upload";
import companiesRouter from "./routes/companies";
import candidatesRouter from "./routes/candidates";
import matchRouter from "./routes/match";
import recommendationsRouter from "./routes/recommendations";
import billingRouter from "./routes/billing";
import dashboardRouter from "./routes/dashboard";
import adminRouter from "./routes/admin";
import searchRouter from "./routes/search";
import { getSupabaseAdmin } from "./supabase";
import { getEmbedding } from "./services/aiService";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil" as any,
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

export function createServer() {
  const app = express();

  // The request handler must be the first middleware on the app
  app.use(Sentry.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.tracingHandler());

  // Middleware
  app.use(cors());

  // Stripe webhook handler needs to be before express.json()
  app.post(
    "/api/billing/webhooks",
    express.raw({ type: "application/json" }),
    async (req, res) => {
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
    }
  );

  // JSON parsing middleware for all other routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health and readiness probes
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/readyz", async (_req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("jobs").select("id").limit(1);

      if (error) {
        throw new Error("Supabase connection check failed");
      }

      res.status(200).json({ status: "ready" });
    } catch (error) {
      console.error("Readiness check failed:", error);
      res.status(503).json({ status: "not_ready" });
    }
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // App routes
  app.use("/api/jobs", jobsRouter);
  app.use("/api/scrape", scrapeRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/companies", companiesRouter);
  app.use("/api/candidates", candidatesRouter);
  app.use("/api/match", matchRouter);
  app.use("/api/recommendations", recommendationsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/search", searchRouter);

  // Temporary test route for recommendations
  app.get("/api/test-recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const supabase = getSupabaseAdmin();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("bio, skills")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        return res
          .status(404)
          .json({ error: `User profile not found for ID: ${userId}` });
      }

      const profileText = `Bio: ${profile.bio || ""}\nSkills: ${(profile.skills || []).join(", ")}`;
      if (!profileText.trim()) {
        return res
          .status(400)
          .json({
            error: "User profile is empty, cannot generate recommendations.",
          });
      }
      const userEmbedding = await getEmbedding(profileText);

      const { data: jobs, error: matchError } = await supabase.rpc(
        "match_jobs",
        {
          query_embedding: userEmbedding,
          match_threshold: 0.7,
          match_count: 10,
        },
      );

      if (matchError) throw matchError;

      res.json({ jobs: jobs ?? [] });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message ?? "Unknown error" });
    }
  });

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.errorHandler());

  return app;
}
