import { z } from "zod";

// Barangay form (create/edit)
export const beneficiaryFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  dob: z.date(),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  validId: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "Valid ID is required",
    }),
  status: z.enum(["claimed", "unclaimed"]),
  address: z.object({
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    barangay: z.string().min(1, "Barangay is required"),
  }),
});

// Type export
export type BeneficiaryFormData = z.infer<typeof beneficiaryFormSchema>;
