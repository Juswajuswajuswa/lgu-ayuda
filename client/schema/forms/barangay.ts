import { z } from "zod";

// Barangay form (create/edit)
export const barangayFormSchema = z.object({
  name: z.string().min(1, "Barangay name is required").max(100),
  municipality: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  population: z
    .number({
      invalid_type_error: "Population must be a number",
    })
    .int("Population must be a whole number")
    .nonnegative("Population cannot be negative")
    .optional(),
});

// Type export
export type BarangayFormData = z.infer<typeof barangayFormSchema>;
