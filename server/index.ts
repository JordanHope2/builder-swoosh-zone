// server/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import jobsRouter from "./routes/jobs";
import scrapeRouter from "./routes/scrape";
import uploadRouter from "./routes/upload";
import companiesRouter from "./routes/companies";
import candidatesRouter from "./routes/candidates";
import matchRouter from "./routes/match";
import profileRouter from "./routes/profile";
import applicationsRouter from "./routes/applications";
import favoritesRouter from "./routes/favorites";

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

  // App routes
  app.use("/api/jobs", jobsRouter);
  app.use("/api/scrape", scrapeRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/companies", companiesRouter);
  app.use("/api/candidates", candidatesRouter);
  app.use("/api/match", matchRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/applications", applicationsRouter);
  app.use("/api/favorites", favoritesRouter);

  return app;
}
