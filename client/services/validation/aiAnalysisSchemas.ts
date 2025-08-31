import { z } from 'zod';

export const CVAnalysisResultSchema = z.object({
  overallScore: z.number(),
  skillsMatch: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
    score: z.number(),
  }),
  experienceAnalysis: z.object({
    yearsOfExperience: z.number(),
    relevantExperience: z.number(),
    score: z.number(),
  }),
  educationAnalysis: z.object({
    degree: z.string(),
    relevance: z.number(),
    score: z.number(),
  }),
  recommendations: z.array(z.string()),
  improvementAreas: z.array(z.string()),
  strengths: z.array(z.string()),
  compatibilityWithJobs: z.array(z.object({
    jobId: z.string(),
    jobTitle: z.string(),
    compatibilityScore: z.number(),
    reasons: z.array(z.string()),
  })),
});
