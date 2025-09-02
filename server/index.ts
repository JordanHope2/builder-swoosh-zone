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
import { getSupabaseAdmin } from "./supabase";
import { getEmbedding } from "./services/aiService";
import { handleStripeWebhook } from "./routes/billing";

if (process.env.VITEST !== 'true') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Performance Monitoring
    tracesSampleRate: 1.0,
  });
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Stripe webhook handler needs to be before express.json()
  app.post( "/api/billing/webhooks", express.raw({ type: "application/json" }), handleStripeWebhook );

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
  if (process.env.VITEST !== 'true') {
    Sentry.setupExpressErrorHandler(app);
  }

  return app;
}
