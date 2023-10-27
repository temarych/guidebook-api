import { z } from 'zod';

export const createGuideSchema = z.object({
  title      : z.string(),
  emoji      : z.string().emoji(),
  description: z.string(),
  image      : z.string()
});

export type ICreateGuideSchema = z.infer<typeof createGuideSchema>;
