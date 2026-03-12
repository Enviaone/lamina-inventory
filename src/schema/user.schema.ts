import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(1, 'Full name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  isActive: z.boolean().default(true),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
