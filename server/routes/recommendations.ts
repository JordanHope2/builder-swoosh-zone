import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getSupabase, getSupabaseAdmin } from "../supabase";
import { getEmbedding } from "../services/aiService";

const router = Router();

/**
 * GET /api/recommendations — get personalized job recommendations
 * SECURED: Uses authMiddleware to verify JWT.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = getSupabaseAdmin();

    // 1. Fetch the user's profile to get their skills/bio for matching
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("bio, skills")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // 2. Generate an embedding for the user's profile
    const profileText = `Bio: ${profile.bio || ""}\nSkills: ${(profile.skills || []).join(", ")}`;
    if (!profileText.trim()) {
      return res
        .status(400)
        .json({
          error: "User profile is empty, cannot generate recommendations.",
        });
    }
    const userEmbedding = await getEmbedding(profileText);

    // 3. Call the database function to find matching jobs
    const { data: jobs, error: matchError } = await supabase.rpc("match_jobs", {
      query_embedding: userEmbedding,
      match_threshold: 0.7, // This can be tuned
      match_count: 10, // Limit to top 10 matches
    });

    if (matchError) {
      throw matchError;
    }

    // For now, we are just returning the pre-filtered jobs.
    // In the future, this is where we would add the GPT-4 re-ranking step.
    res.json({ jobs: jobs ?? [] });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
