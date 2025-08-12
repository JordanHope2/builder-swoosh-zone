import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    // In a real application, this data would come from a database or a caching layer.
    const stats = {
      activeJobs: "10,000+",
      registeredUsers: "50,000+",
      successRate: "95%",
    };
    res.json(stats);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
