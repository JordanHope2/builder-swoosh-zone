import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";
import type { Database } from "../../app/types/supabase";

type Candidate = Database['public']['Tables']['candidates']['Row'];

const router = Router();

// This endpoint is now protected and requires authentication.
// Further role-based authorization could be added in the future.
router.get("/", authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  // Corrected table name from `scraped_candidates` to `candidates`
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  res.json(data);
}));

export default router;
