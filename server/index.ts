// server/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import statsRouter from "./routes/stats";
import companiesRouter from "./routes/companies";

// ⬇️ AJOUTE CETTE LIGNE
import jobsRouter from "./routes/jobs";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ⬇️ AJOUTE CETTE LIGNE
  app.use("/api/jobs", jobsRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/companies", companiesRouter);

  return app;
}
