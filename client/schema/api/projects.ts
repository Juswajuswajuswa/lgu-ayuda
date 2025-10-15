import { z } from "zod";
import { mongoIdSchema } from "../common/base";

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, "Title cannot be empty."),
  status: z.enum(["in progress", "completed", "cancelled"]),
});

const dbTodoSchema = createTodoSchema.extend({
  _id: mongoIdSchema,
});

// 3. Schema for CREATING a project
export const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name cannot be empty."),
  description: z.string(),
  budget: z.number({ required_error: "Budget is required." }),
  status: z.enum(["in progress", "completed", "cancelled"]),
});

export const projectSchema = z.object({
  _id: mongoIdSchema,
  projectName: z.string(),
  description: z.string(), // CORRECTED: Now optional to match Mongoose
  budget: z.number(),
  status: z.enum(["in progress", "completed", "cancelled"]),
  projectTodos: z.array(dbTodoSchema), // CORRECTED: Uses the schema WITH `_id`
});

export const mutateProjectResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: projectSchema.optional(),
});

export const getProjectsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(projectSchema),
});

// 5. Schema for UPDATING a project (no changes needed here)
export const updateProjectSchema = createProjectSchema.partial();

// --- TypeScript Types ---
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Project = z.infer<typeof projectSchema>;
export type MutateProjectsResponse = z.infer<typeof mutateProjectResponse>;

export type GetProjectsResponse = z.infer<typeof getProjectsResponseSchema>;
