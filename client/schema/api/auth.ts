import { z } from "zod";
import { emailSchema, passwordSchema } from "../common/base";

// Login request
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Login response
export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.enum(["admin", "staff", "user"]),
    })
    .optional(),
});

// Check admin response
export const checkAdminResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// OTP request
export const otpRequestSchema = z.object({
  email: emailSchema,
});

// OTP verify request
export const verifyOtpRequestSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Create admin request
export const createAdminRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Forgot password request
export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

// Password reset request
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

// Type exports
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type CheckAdminResponse = z.infer<typeof checkAdminResponseSchema>;
export type OtpRequest = z.infer<typeof otpRequestSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type CreateAdminRequest = z.infer<typeof createAdminRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
