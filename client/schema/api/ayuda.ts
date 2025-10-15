import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

// Ayuda entity
export const ayudaSchema = z.object({
  _id: mongoIdSchema,
  name: z.string(),
  type: z.enum(["cash", "goods"]),
  budget: z.number().int().min(1, "Budget is required"),
  description: z.string().optional(),
  amount: z.number().optional(),
  goods: z.array(z.string()).optional(),
  ...timestampSchema.shape,
});

// Create ayuda request
export const createAyudaRequestSchema = z.object({
  name: z.string().min(1, "Barangay name is required"),
  type: z.enum(["cash", "goods"]),
  budget: z.number().int().min(1, "Budget is required"),
  description: z.string().optional(),
  amount: z.number().optional(),
  goods: z.array(z.string()).optional(),
});

// Update ayuda request
export const updateAyudaRequestSchema = createAyudaRequestSchema.partial();

// Get ayudas response
export const getAyudasResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(ayudaSchema),
});

// Get single ayuda response
export const getAyudaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ayudaSchema,
});

// Type exports
export type Ayuda = z.infer<typeof ayudaSchema>;
export type CreateAyudaRequest = z.infer<typeof createAyudaRequestSchema>;
export type UpdateAyudaRequest = z.infer<typeof updateAyudaRequestSchema>;
export type GetAyudasResponse = z.infer<typeof getAyudasResponseSchema>;
export type GetAyudaResponse = z.infer<typeof getAyudaResponseSchema>;
