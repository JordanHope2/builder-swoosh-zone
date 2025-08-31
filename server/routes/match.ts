import { spawn } from "child_process";
import path from "path";
import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getSupabaseAdmin } from "../supabase";
import { MatchSchema } from "../validation/matchSchemas";

const router = Router();

router.post("/", asyncHandler(async (req: Request, res: Response) => {
  const parsed = MatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { candidateId, jobId } = parsed.data;

  const supabase = getSupabaseAdmin();

  // 1. Fetch candidate and job data from Supabase
  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .select("bio")
    .eq("id", candidateId)
    .single();

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("description")
    .eq("id", jobId)
    .single();

  if (candidateError || jobError) {
    console.error(
      "Error fetching data from Supabase:",
      candidateError || jobError,
    );
    res.status(404).json({ error: "Candidate or Job not found." });
    return;
  }

  if (!candidate?.bio || !job?.description) {
    res.status(400).json({ error: "Candidate bio or job description is missing." });
    return;
  }

  // 2. Execute the Python matching script
  await new Promise<void>((resolve, reject) => {
    const pythonScriptPath = path.join(
      __dirname,
      "../../job_scraper/analysis/matching_service.py",
    );
    const pythonProcess = spawn("python3", [
      pythonScriptPath,
      candidate.bio,
      job.description,
    ]);

    let matchScore = "";
    pythonProcess.stdout.on("data", (data) => {
      matchScore += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr from Python script: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        reject(new Error("Failed to calculate match score."));
        return;
      }

      // 3. Return the score
      res.json({ match_score: parseInt(matchScore.trim(), 10) });
      resolve();
    });
  });
}));

export default router;
