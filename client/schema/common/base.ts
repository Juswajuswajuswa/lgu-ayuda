import { z } from "zod";

/**
 * Common reusable schema primitives
 */

// Email validation
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

// Phone validation (optional)
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number")
  .optional();

// String fields
export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional();

// Number fields
export const positiveNumber = z.number().positive("Must be a positive number");
export const nonNegativeNumber = z
  .number()
  .nonnegative("Must be zero or greater");

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().nonnegative().optional(),
});

// Timestamp schema
export const timestampSchema = z.object({
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// MongoDB ID validation
export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// API Response wrapper
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
  });

// API Error response
export const apiErrorSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.record(z.string(), z.string()).optional(),
});
