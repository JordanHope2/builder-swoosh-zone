import { Router } from "express";
import { getSupabase } from "../supabase";

const router = Router();

router.get("/featured", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .eq("featured", true);

    if (error) throw error;

    res.json(data ?? []);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
