import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getSupabaseAdmin } from "../supabase";
import type { Database } from "../../app/types/supabase";

type Company = Database['public']['Tables']['companies']['Row'];

const router = Router();

router.get("/", asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  res.json(data);
}));

export default router;
