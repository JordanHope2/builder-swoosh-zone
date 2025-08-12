import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../supabase";

const router = Router();

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  userType: z.string(),
});

router.post("/submit", async (req, res) => {
  try {
    const parsed = contactFormSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("contact_submissions")
      .insert([parsed.data]);

    if (error) throw error;

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown error" });
  }
});

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
