import { z } from 'zod';

export const AIMatchBreakdownSchema = z.object({
  skills: z.number(),
  experience: z.number(),
  education: z.number(),
  location: z.number(),
  salary: z.number(),
});

export const AIMatchReportSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  userId: z.string(),
  matchPercent: z.number(),
  breakdown: AIMatchBreakdownSchema,
  strengths: z.array(z.string()),
  recommendations: z.array(z.string()),
  generatedAt: z.string(),
  updatedAt: z.string(),
});

// The AI response is a subset of the full report
export const AIResponseSchema = z.object({
  overallMatch: z.number(),
  breakdown: AIMatchBreakdownSchema,
  strengths: z.array(z.string()),
  recommendations: z.array(z.string()),
});
