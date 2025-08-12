import { Router } from "express";
import { getSupabase } from "../supabase";

const router = Router();

router.get("/links", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("footer_links")
      .select("id, text, url, category");

    if (error) throw error;

    const links = (data ?? []).reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push({ id: link.id, text: link.text, url: link.url });
      return acc;
    }, {} as Record<string, { id: string; text: string; url: string }[]>);

    res.json(links);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
