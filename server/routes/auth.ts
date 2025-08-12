import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../supabase";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

router.post("/signup", async (req, res) => {
  try {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;
    res.status(200).json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message ?? "Authentication failed" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    res.status(200).json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message ?? "Authentication failed" });
  }
});

router.post("/signout", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
    res.status(200).json({ message: "Signed out successfully" });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Sign out failed" });
  }
});

export default router;
