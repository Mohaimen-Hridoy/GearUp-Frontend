import { z } from "zod";

/**
 * Common validation schemas
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const urlSchema = z
  .string()
  .url("Invalid URL")
  .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  });

export const positiveNumberSchema = z
  .number()
  .min(0, "Must be a positive number");

export const positiveIntegerSchema = z
  .number()
  .int("Must be a whole number")
  .min(0, "Must be a positive number");
