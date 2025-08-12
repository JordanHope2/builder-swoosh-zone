// server/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import { handleAiChat } from "./routes/ai";
import {
  createCheckoutSession,
  handleStripeWebhook,
  getSubscription,
} from "./routes/stripe";

// ⬇️ AJOUTE CETTE LIGNE
import jobsRouter from "./routes/jobs";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/ai/chat", handleAiChat);

  // Stripe routes
  app.post("/api/stripe/create-checkout-session", createCheckoutSession);
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  app.get("/api/stripe/subscription", getSubscription);

  // ⬇️ AJOUTE CETTE LIGNE
  app.use("/api/jobs", jobsRouter);

  return app;
}
