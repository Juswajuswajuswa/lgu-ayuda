import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

// Populated Barangay (when fetched from API)
export const populatedBarangaySchema = z.object({
  _id: mongoIdSchema,
  name: z.string(),
  municipality: z.string(),
  province: z.string(),
});

// Populated Beneficiary (when fetched from API)
export const populatedBeneficiarySchema = z.object({
  _id: mongoIdSchema,
  fullName: z.string(),
  dob: z.coerce.date,
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string(),
  validId: z.string(),
  isApplied: z.boolean(),
  address: z.object({
    municipality: z.string(),
    province: z.string(),
    barangay: populatedBarangaySchema,
  }),
  ...timestampSchema.shape,
});

// Populated Ayuda (when fetched from API)
export const populatedAyudaSchema = z.object({
  _id: mongoIdSchema,
  name: z.string(),
  type: z.enum(["cash", "goods"]),
  amount: z.number().optional(),
});

// Application
export const applicationSchema = z.object({
  _id: mongoIdSchema,
  beneficiary: populatedBeneficiarySchema,
  ayuda: populatedAyudaSchema,
  submittedBy: mongoIdSchema,
  status: z.enum(["pending", "approved", "rejected"]),
  notes: z.string().optional(),
  ...timestampSchema.shape,
});

// Get applications response
export const getApplicationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(applicationSchema),
});

// Update application status request
export const updateApplicationStatusRequestSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

// Update application status response
export const updateApplicationStatusResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: applicationSchema,
});

// Create application request
export const createApplicationRequestSchema = z.object({
  beneficiary: z.string().min(1, "Beneficiary is required"),
  ayuda: z.string().min(1, "Ayuda is required"),
  notes: z.string().optional(),
});

// Create application response
export const createApplicationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: applicationSchema,
});

// Type exports
export type Application = z.infer<typeof applicationSchema>;
export type GetApplicationsResponse = z.infer<
  typeof getApplicationsResponseSchema
>;
export type UpdateApplicationStatusRequest = z.infer<
  typeof updateApplicationStatusRequestSchema
>;
export type UpdateApplicationStatusResponse = z.infer<
  typeof updateApplicationStatusResponseSchema
>;
export type CreateApplicationRequest = z.infer<
  typeof createApplicationRequestSchema
>;
export type CreateApplicationResponse = z.infer<
  typeof createApplicationResponseSchema
>;
export type PopulatedBeneficiary = z.infer<typeof populatedBeneficiarySchema>;
export type PopulatedAyuda = z.infer<typeof populatedAyudaSchema>;
