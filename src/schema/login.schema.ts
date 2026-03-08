import { z } from 'zod';

export const emailLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits long").max(10, "Phone number must be at most 10 digits long"),
});

export const otpLoginSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 digits long").max(6, "OTP must be at most 6 digits long"),
});

export type EmailLoginSchema = z.infer<typeof emailLoginSchema>;
export type PhoneLoginSchema = z.infer<typeof phoneLoginSchema>;
export type OtpLoginSchema = z.infer<typeof otpLoginSchema>;