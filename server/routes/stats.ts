import { Router } from "express";
import { getSupabase } from "../supabase";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("stats")
      .select("active_jobs, registered_users, success_rate")
      .single();

    if (error) throw error;

    const stats = {
      activeJobs: data.active_jobs,
      registeredUsers: data.registered_users,
      successRate: data.success_rate,
    };

    res.json(stats);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

export default router;
