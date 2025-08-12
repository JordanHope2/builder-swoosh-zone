// server/routes/jobs.ts
import { Router } from "express";
import { z } from "zod";
import { getSupabase, getSupabaseAdmin } from "../supabase";

const router = Router();

/**
 * GET /api/jobs — list all jobs (public)
 * Uses anon client -> respects RLS
 */
router.get("/", async (req, res) => {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (req.query.featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json({ jobs: data ?? [] });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

/**
 * POST /api/jobs — create a job
 * TEMP auth: reads x-user-id header (replace with real auth soon)
 * Uses admin client to allow server-side insert (bypasses RLS).
 * DB column is owner_id (NOT "owner").
 */
const createJobSchema = z.object({
  title: z.string().min(1, "title required"),
  description: z.string().optional(),
  location: z.string().optional(),
  // coerce allows "60000" (string) or 60000 (number)
  salary_min: z.coerce.number().int().optional(),
  salary_max: z.coerce.number().int().optional(),
});

router.post("/", async (req, res) => {
  try {
    const userId = req.header("x-user-id"); // ⚠️ prototype; replace with verified user id from JWT
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const supabase = getSupabaseAdmin(); // server-only
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        owner_id: userId, // IMPORTANT: matches DB column name
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
