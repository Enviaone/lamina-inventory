import { z } from 'zod';

export const brandFormSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(60, 'Name is too long'),
});

export type BrandFormSchema = z.infer<typeof brandFormSchema>;

export const brandItemFormSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Name is too long'),
});

export type BrandItemFormSchema = z.infer<typeof brandItemFormSchema>;

