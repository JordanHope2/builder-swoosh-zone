import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";

const router = Router();

router.get("/recruiter", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const supabase = getSupabaseAdmin();

  try {
    // We should also check the user's role here.
    // For now, we assume any authenticated user hitting this is a recruiter.
    // A proper implementation would check `req.user.role === 'pro'`.

    // Fetch all jobs owned by the recruiter
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id, title, created_at, status")
      .eq("owner_id", userId);

    if (jobsError) throw jobsError;

    const jobIds = jobs.map(job => job.id);

    // Fetch all applications for those jobs
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("job_id, status, created_at")
      .in("job_id", jobIds);

    if (appsError) throw appsError;

    // --- Aggregate Data ---

    // 1. Stats Overview
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const totalApplicants = applications.length;
    // More complex stats like "hired this month" would require more logic

    // 2. Hiring Pipeline
    const pipeline = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 3. Job Postings with Applicant Counts
    const jobsWithCounts = jobs.map(job => {
      const applicantCount = applications.filter(app => app.job_id === job.id).length;
      return {
        ...job,
        applicantCount,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


    res.json({
      stats: {
        activeJobs,
        totalApplicants,
      },
      pipeline,
      jobs: jobsWithCounts,
    });

  } catch (error: any) {
    console.error("Error fetching recruiter dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
});

export default router;
