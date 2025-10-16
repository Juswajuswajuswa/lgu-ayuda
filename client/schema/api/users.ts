import { z } from "zod";
import { emailSchema, mongoIdSchema, timestampSchema } from "../common/base";

// User entity
export const userSchema = z.object({
  _id: mongoIdSchema,
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["admin", "encoder", "validator", "distributer"]),
  isActive: z.boolean().optional(),
  ...timestampSchema.shape,
});

// Create user request
export const createUserRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z
    .enum(["admin", "encoder", "validator", "distributer"])
    .default("encoder"),
});

// Update user request
export const updateUserRequestSchema = createUserRequestSchema.partial();

// Get users response
export const getUsersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  users: z.array(userSchema),
});

// Get single user response
export const getUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userSchema,
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>;
export type GetUserResponse = z.infer<typeof getUserResponseSchema>;
