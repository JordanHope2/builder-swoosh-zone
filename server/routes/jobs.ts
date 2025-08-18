// server/routes/jobs.ts
import { Router } from "express";
import { z } from "zod";
import { getSupabase, getSupabaseAdmin } from "../supabase";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * GET /api/jobs — list all jobs (public)
 * Uses anon client -> respects RLS
 */
router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ jobs: data ?? [] });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

/**
 * POST /api/jobs — create a job
 * SECURED: Uses authMiddleware to verify JWT.
 * Uses admin client to allow server-side insert (bypasses RLS), but owner_id is from a verified token.
 */
const createJobSchema = z.object({
  title: z.string().min(1, "title required"),
  description: z.string().optional(),
  location: z.string().optional(),
  salary_min: z.coerce.number().int().optional(),
  salary_max: z.coerce.number().int().optional(),
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        owner_id: userId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        location: parsed.data.location ?? null,
        salary_min: parsed.data.salary_min ?? null,
        salary_max: parsed.data.salary_max ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ job: data });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
