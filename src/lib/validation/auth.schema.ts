import { z } from "zod";

// ══════════════════════════════════════════════════════════
// Auth Schemas
// ══════════════════════════════════════════════════════════

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;   