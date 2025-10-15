import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  CheckAdminResponse,
  OtpRequest,
  VerifyOtpRequest,
  CreateAdminRequest,
  ForgotPasswordRequest,
  PasswordResetRequest,
} from "@/schema/api/auth";
import type { ApiResponse } from "./types";

/**
 * Authentication API service
 */

export const authService = {
  /**
   * Check if admin exists in the system
   */
  checkAdmin: async (): Promise<CheckAdminResponse> => {
    return apiClient.get("/auth/admin");
  },

  /**
   * Sign in user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post("/auth/signin", data);
  },

  /**
   * Sign out user
   */
  logout: async (): Promise<ApiResponse> => {
    return apiClient.post("/auth/signout");
  },

  /**
   * Request OTP for password reset
   */
  requestOtp: async (data: OtpRequest): Promise<ApiResponse> => {
    return apiClient.post("/auth/request-otp", data);
  },

  /**
   * Send forgot password email
   */
  sendForgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse> => {
    return apiClient.post("/auth/send-forgetpassword", data);
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse> => {
    return apiClient.post("/auth/verify-token", data);
  },

  /**
   * Resend OTP code
   */
  resendOtp: async (data: OtpRequest): Promise<ApiResponse> => {
    return apiClient.post("/auth/resend-otp", data);
  },

  /**
   * Password reset
   */
  passwordReset: async (data: PasswordResetRequest): Promise<ApiResponse> => {
    return apiClient.put(`/auth/forget-password/${data.email}`, data);
  },

  /**
   * Create admin account
   */
  createAdmin: async (data: CreateAdminRequest): Promise<ApiResponse> => {
    return apiClient.post("/auth/create-admin", data);
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<LoginResponse> => {
    return apiClient.get("/auth/me");
  },
};

export default authService;
