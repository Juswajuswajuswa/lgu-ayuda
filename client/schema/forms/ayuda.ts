import { z } from "zod";

// Ayuda form (create/edit)
export const ayudaFormSchema = z.object({
  name: z.string().min(1, "Ayuda name is required").max(100),
  type: z.enum(["cash", "goods"]),
  budget: z.number().int().min(1, "Budget is required"),
  description: z.string().optional(),
  amount: z.number().int().optional(),
  goods: z.array(z.string()).optional(),
});

// Type export
export type AyudaFormData = z.infer<typeof ayudaFormSchema>;
