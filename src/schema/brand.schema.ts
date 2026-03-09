import { z } from 'zod';

export const brandFormSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(60, 'Name is too long'),
  code: z
    .string()
    .min(1, 'Brand code is required')
    .max(20, 'Code is too long')
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, numbers, or hyphens'),
  color: z.enum(['blue', 'rose', 'amber', 'violet', 'green', 'orange'] as const),
});

export type BrandFormSchema = z.infer<typeof brandFormSchema>;

export const brandItemFormSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Name is too long'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU is too long'),
});

export type BrandItemFormSchema = z.infer<typeof brandItemFormSchema>;

