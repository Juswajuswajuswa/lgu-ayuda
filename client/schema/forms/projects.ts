import { z } from "zod";

export const projectsTodoSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, "Title cannot be empty."),
  status: z.enum(["in progress", "completed", "cancelled"]).optional()
});

export const projectsFormSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(200, "Description must at most 200 characters"),

  // The only change is here:
  budget: z
    .number({
      invalid_type_error: "Budget must be a number.",
    })
    .int()
    .min(0, "Budget cannot be negative."),

  status: z.enum(["in progress", "completed", "cancelled"]),
});

export type ProjectsFormData = z.infer<typeof projectsFormSchema>;
export type ProjectTodoFormData = z.infer<typeof projectsTodoSchema>;
