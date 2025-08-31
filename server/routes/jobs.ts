// server/routes/jobs.ts
import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { NewJobSchema, type NewJobInput } from "../validation/jobSchemas";
import { getSupabase, getSupabaseAdmin } from "../supabase";
import type { Database } from "../../app/types/supabase";

type Job = Database['public']['Tables']['jobs']['Row'];
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * GET /api/jobs — list all jobs (public)
 * Uses anon client -> respects RLS
 */
router.get("/", asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  // Select jobs and join the related company data
  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // Add a placeholder matchScore to each job for frontend development
  const jobsWithMatchScore = (data ?? []).map((job) => ({
    ...job,
    matchScore: Math.floor(Math.random() * (99 - 50 + 1)) + 50, // Random score between 50-99
  }));

  res.json({ jobs: jobsWithMatchScore });
}));

/**
 * POST /api/jobs — create a job
 * SECURED: Uses authMiddleware to verify JWT.
 * Uses admin client to allow server-side insert (bypasses RLS), but owner_id is from a verified token.
 */
router.post("/", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const parsed = NewJobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const input: NewJobInput = parsed.data;
  const userId = req.user.id;


  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      owner_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json({ job: data });
}));

export default router;
