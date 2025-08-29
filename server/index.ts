// server/index.ts
import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import { expressMiddleware } from '@apollo/server/express4';
import { jobsServer } from './graphql/subgraphs/jobs';
import { usersServer } from './graphql/subgraphs/users';
import { gatewayServer } from './graphql/gateway';
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
import authRouter from './routes/auth';
import { getSupabaseAdmin } from "./supabase";
import { getEmbedding } from "./services/aiService";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: express() }),
  ],
  tracesSampleRate: 1.0,
});

export async function createServer() {
  const app = express();

  await jobsServer.start();
  await usersServer.start();
  await gatewayServer.start();

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post(
    "/api/billing/webhooks",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      // ... (webhook logic)
    }
  );

  app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));
  app.get("/readyz", async (_req, res) => {
    // ... (readiness logic)
  });

  app.use('/graphql/jobs', expressMiddleware(jobsServer));
  app.use('/graphql/users', expressMiddleware(usersServer));
  app.use('/graphql', expressMiddleware(gatewayServer));

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
  app.use('/api/auth', authRouter);

  app.use(Sentry.Handlers.errorHandler());

  return app;
}
