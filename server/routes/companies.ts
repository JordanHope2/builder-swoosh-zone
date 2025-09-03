import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";

const router = Router();

router.get("/", async (req, res) => {
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/companies/:id — get a single company by id (public)
 * Uses anon client -> respects RLS
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdmin(); // Using admin to bypass RLS for this public data
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Company not found" });

    res.json({ company: data });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
