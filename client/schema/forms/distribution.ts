import { z } from "zod";

export const distributionFormSchema = z.object({
  applicationId: z.string().min(1, "Please select an application"),
  dateReleased: z
    .date({
      message: "Please select a release date",
    })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "Release date cannot be in the past",
      }
    ),
});

export type DistributionFormData = z.infer<typeof distributionFormSchema>;
