import { z } from 'zod';

export const PresignedUrlSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
});
export type PresignedUrlInput = z.infer<typeof PresignedUrlSchema>;
