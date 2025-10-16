import { z } from "zod";

export const applicationFormSchema = z.object({
  beneficiary: z.string().min(1, "Please select a beneficiary"),
  ayuda: z.string().min(1, "Please select an ayuda program"),
  notes: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
