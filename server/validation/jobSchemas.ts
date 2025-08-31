import { z } from 'zod';

export const NewJobSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2).optional(),
  description: z.string().min(10),
  company: z.string().min(2),
});
export type NewJobInput = z.infer<typeof NewJobSchema>;
