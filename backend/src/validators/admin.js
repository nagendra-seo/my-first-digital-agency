import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const verify2faSchema = z.object({
  code: z.string().trim().min(6).max(10).regex(/^[A-Za-z0-9-]+$/, "Enter the 6-digit code or a recovery code"),
});

export const setup2faVerifySchema = z.object({
  code: z.string().trim().length(6).regex(/^\d{6}$/, "Enter the 6-digit code"),
});
