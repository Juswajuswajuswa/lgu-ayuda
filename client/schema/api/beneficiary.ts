import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

// Populated Barangay (when fetched from API)
export const populatedBarangaySchema = z.object({
  _id: mongoIdSchema,
  name: z.string(),
  municipality: z.string(),
  province: z.string(),
});

// Beneficiary
export const beneficiarySchema = z.object({
  _id: mongoIdSchema,
  fullName: z.string().min(1, "Name is required"),
  dob: z.coerce.date,
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  validId: z.string(),
  address: z.object({
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    barangay: z.union([z.string(), populatedBarangaySchema]),
  }),
  ...timestampSchema.shape,
});

// Get beneficiaries
export const getBeneficiariesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  beneficiaries: z.array(beneficiarySchema),
});

// Get single beneficiary
export const getBeneficiaryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: beneficiarySchema.optional(),
  beneficiary: beneficiarySchema.optional(),
});

// Create beneficiary
export const createBeneficiaryRequestSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  dob: z.date(),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  validId: z.string().min(1, "Valid ID is required"),
  status: z.enum(["claimed", "unclaimed"]).default("unclaimed"),
  address: z.object({
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    barangay: z.string().min(1, "Barangay is required"),
  }),
  ...timestampSchema.shape,
});

// Update beneficiary
export const updateBeneficiaryRequestSchema = createBeneficiaryRequestSchema
  .partial()
  .omit({
    validId: true,
  });

// Type exports
export type Beneficiary = z.infer<typeof beneficiarySchema>;
export type GetBeneficiariesResponse = z.infer<
  typeof getBeneficiariesResponseSchema
>;
export type GetBeneficiaryResponse = z.infer<
  typeof getBeneficiaryResponseSchema
>;
export type CreateBeneficiaryRequest = z.infer<
  typeof createBeneficiaryRequestSchema
>;
export type UpdateBeneficiaryRequest = z.infer<
  typeof updateBeneficiaryRequestSchema
>;
