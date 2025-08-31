import { z } from 'zod';

export const MatchSchema = z.object({
  candidateId: z.string(),
  jobId: z.string(),
});
export type MatchInput = z.infer<typeof MatchSchema>;
