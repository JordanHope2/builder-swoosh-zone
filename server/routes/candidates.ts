import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// This endpoint is now protected and requires authentication.
// Further role-based authorization could be added in the future.
router.get("/", authMiddleware, async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    // Corrected table name from `scraped_candidates` to `candidates`
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
