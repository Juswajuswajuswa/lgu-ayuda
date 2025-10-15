import { apiClient } from "./client";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersResponse,
  GetUserResponse,
} from "@/schema/api/users";
import type { ApiResponse } from "./types";

/**
 * Users/Staff API service
 */

export const usersService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<GetUsersResponse> => {
    return apiClient.get("/user/get-users");
  },

  /**
   * Get single user by ID
   */
  getById: async (id: string): Promise<GetUserResponse> => {
    return apiClient.get(`/user/get-user/${id}`);
  },

  /**
   * Create new user/staff
   */
  create: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return apiClient.post("/user/register-user", data);
  },

  /**
   * Update existing user
   */
  update: async (
    id: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<User>> => {
    return apiClient.put(`/user/update-user/${id}`, data);
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/user/delete-user/${id}`);
  },
};

export default usersService;
