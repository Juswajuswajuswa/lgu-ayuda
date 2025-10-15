import { z } from "zod";
import { emailSchema, passwordSchema } from "../common/base";

// Login form
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Forgot password form
export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

// OTP verification form
export const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Create admin form
export const createAdminFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;
export type OtpFormData = z.infer<typeof otpFormSchema>;
export type CreateAdminFormData = z.infer<typeof createAdminFormSchema>;
