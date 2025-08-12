import { Router } from "express";
import { getSupabase } from "../supabase";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();

    const [
      supportTypesRes,
      officesRes,
    ] = await Promise.all([
      supabase.from("support_types").select("*"),
      supabase.from("offices").select("*"),
    ]);

    if (supportTypesRes.error || officesRes.error) {
      throw new Error("Failed to fetch Contact page data");
    }

    res.json({
      supportTypes: supportTypesRes.data ?? [],
      offices: officesRes.data ?? [],
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
