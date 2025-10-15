import { z } from "zod";

// Barangay form (create/edit)
export const beneficiaryFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  dob: z.date().refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return date <= eighteenYearsAgo;
  }, "Beneficiary must be at least 18 years old"),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  validId: z
    .instanceof(File, { message: "Valid ID is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        ),
      {
        message: "Only JPEG, PNG, and GIF images are allowed",
      }
    ),
  status: z.enum(["claimed", "unclaimed"]),
  address: z.object({
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    barangay: z.string().min(1, "Barangay is required"),
  }),
});

// Beneficiary edit form (excludes validId)
export const beneficiaryEditFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  dob: z.date(),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.object({
    municipality: z.string().min(1, "Municipality is required"),
    province: z.string().min(1, "Province is required"),
    barangay: z.string().min(1, "Barangay is required"),
  }),
});

// Type exports
export type BeneficiaryFormData = z.infer<typeof beneficiaryFormSchema>;
export type BeneficiaryEditFormData = z.infer<typeof beneficiaryEditFormSchema>;
