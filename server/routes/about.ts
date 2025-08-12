import { Router } from "express";
import { getSupabase } from "../supabase";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();

    const [
      teamMembersRes,
      statsRes,
      valuesRes,
      contentRes,
    ] = await Promise.all([
      supabase.from("team_members").select("*"),
      supabase.from("about_page_stats").select("*"),
      supabase.from("company_values").select("*"),
      supabase.from("page_content").select("*").eq("page_slug", "about"),
    ]);

    if (teamMembersRes.error || statsRes.error || valuesRes.error || contentRes.error) {
      throw new Error("Failed to fetch About page data");
    }

    const content = contentRes.data.reduce((acc, item) => {
      acc[item.content_key] = item.content;
      return acc;
    }, {} as Record<string, string>);

    res.json({
      teamMembers: teamMembersRes.data ?? [],
      stats: statsRes.data ?? [],
      values: valuesRes.data ?? [],
      content,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
