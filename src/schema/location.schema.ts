import { z } from 'zod';

export const locationFormSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Name is too long'),
});

export type LocationFormSchema = z.infer<typeof locationFormSchema>;
