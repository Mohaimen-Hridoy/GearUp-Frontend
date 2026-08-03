import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    role: z.enum(["CUSTOMER", "PROVIDER"], { required_error: "Choose an account type" }),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const gearSchema = z.object({
  title: z.string().min(3, "Give it a clear title"),
  description: z.string().min(20, "At least 20 characters"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Choose a category"),
  pricePerDay: z.coerce.number().positive("Must be more than $0"),
  stock: z.coerce.number().int().min(0, "Can't be negative"),
  imageUrl: z.string().url("Enter a valid image URL"),
  // Raw textarea content — one gallery image URL per line. Parsed into an
  // array and validated per-line in the form submit handler rather than
  // here, since an empty textarea is a perfectly valid "no extra photos".
  images: z.string().optional(),
  available: z.boolean().default(true),
});
export type GearInput = z.infer<typeof gearSchema>;
