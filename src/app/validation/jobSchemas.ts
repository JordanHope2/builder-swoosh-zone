import { z } from 'zod';

export const JobSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(''),
  location: z.string().optional().default(''),
  salary_min: z.number().int().nonnegative().optional(),
  salary_max: z.number().int().nonnegative().optional(),
});
