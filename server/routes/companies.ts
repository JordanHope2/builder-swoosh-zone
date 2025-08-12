import { Router } from "express";

const router = Router();

const featuredCompanies = [
  { id: "1", name: "UBS" },
  { id: "2", name: "Nestlé" },
  { id: "3", name: "Roche" },
  { id: "4", name: "ABB" },
];

router.get("/featured", async (_req, res) => {
  try {
    // In a real application, this data would come from a database.
    res.json(featuredCompanies);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
