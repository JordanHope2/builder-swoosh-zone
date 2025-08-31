import { z } from 'zod';

export const CreateCheckoutSessionSchema = z.object({
  priceId: z.string(),
});
export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
