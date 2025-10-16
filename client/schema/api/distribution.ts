import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

export const distributionSchema = z.object({
  _id: mongoIdSchema,
  applicationId: z.any(), // Populated application
  ayudaId: z.any(), // Populated ayuda
  releasedBy: z.any(), // Populated user
  receivedBy: z.string().optional(),
  distributionType: z.enum(["cash", "goods"]),
  dateReleased: z.string().optional(),
  status: z.enum(["pending", "claimed", "unclaimed"]),
});

export const createDistributionRequestSchema = z.object({
  applicationId: z.string().min(1, "Application is required"),
  ayudaId: z.string().min(1, "Ayuda is required"),
  status: z.literal("pending"), // Always pending
  dateReleased: z.string().optional(), // ISO date string
});

export const updateDistributionStatusRequestSchema = z.object({
  status: z.enum(["claimed", "unclaimed"]),
});

export const getDistributionsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(distributionSchema),
});

export const createDistributionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: distributionSchema,
});

export type Distribution = z.infer<typeof distributionSchema>;
export type CreateDistributionRequest = z.infer<
  typeof createDistributionRequestSchema
>;
export type UpdateDistributionStatusRequest = z.infer<
  typeof updateDistributionStatusRequestSchema
>;
export type GetDistributionsResponse = z.infer<
  typeof getDistributionsResponseSchema
>;
export type CreateDistributionResponse = z.infer<
  typeof createDistributionResponseSchema
>;
