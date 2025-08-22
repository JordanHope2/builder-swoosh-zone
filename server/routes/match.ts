import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { authMiddleware } from "../middleware/auth";
import { getEmbedding } from "../services/aiService";

const router = Router();

// POST /api/match/jobs - Find jobs based on a semantic query
router.post("/jobs", authMiddleware, async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "A 'query' string is required." });
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Get the embedding for the user's query
    const queryEmbedding = await getEmbedding(query);

    // 2. Call the Supabase RPC to find matching jobs
    const { data: jobs, error: matchError } = await supabase.rpc(
      "match_jobs",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.75, // Adjust this threshold as needed
        match_count: 10,       // Limit the number of results
      }
    );

    if (matchError) throw matchError;

    res.json({ jobs: jobs ?? [] });
  } catch (error: any) {
    console.error("Error in semantic job match:", error);
    res.status(500).json({ error: "Failed to find matching jobs." });
  }
});

export default router;
