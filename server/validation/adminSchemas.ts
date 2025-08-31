import { z } from 'zod';

export const UpdateUserSchema = z.object({
  role: z.string().optional(),
  status: z.string().optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UpdateJobSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

export const UpdateSubscriptionSchema = z.object({
  action: z.literal('cancel'),
});
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
