import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

// Barangay entity
export const barangaySchema = z.object({
  _id: mongoIdSchema,
  name: z.string(),
  municipality: z.string().optional(),
  province: z.string().optional(),
  population: z.number().int().nonnegative().optional(),
  ...timestampSchema.shape,
});

// Create barangay request
export const createBarangayRequestSchema = z.object({
  name: z.string().min(1, "Barangay name is required"),
  municipality: z.string().optional(),
  province: z.string().optional(),
  population: z.number().int().nonnegative().optional(),
});

// Update barangay request
export const updateBarangayRequestSchema =
  createBarangayRequestSchema.partial();

// Get barangays response
export const getBarangaysResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  barangays: z.array(barangaySchema),
});

// Get single barangay response
export const getBarangayResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: barangaySchema.optional(),
  barangay: barangaySchema.optional(),
});

// Type exports
export type Barangay = z.infer<typeof barangaySchema>;
export type CreateBarangayRequest = z.infer<typeof createBarangayRequestSchema>;
export type UpdateBarangayRequest = z.infer<typeof updateBarangayRequestSchema>;
export type GetBarangaysResponse = z.infer<typeof getBarangaysResponseSchema>;
export type GetBarangayResponse = z.infer<typeof getBarangayResponseSchema>;
