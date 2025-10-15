import { apiClient } from "./client";
import type {
  Barangay,
  CreateBarangayRequest,
  UpdateBarangayRequest,
  GetBarangaysResponse,
  GetBarangayResponse,
} from "@/schema/api/barangay";
import type { ApiResponse } from "./types";

/**
 * Barangay API service
 */

export const barangayService = {
  /**
   * Get all barangays
   */
  getAll: async (): Promise<GetBarangaysResponse> => {
    return apiClient.get("/barangay/get-barangays");
  },

  /**
   * Get single barangay by ID
   */
  getById: async (id: string): Promise<GetBarangayResponse> => {
    return apiClient.get(`/barangay/single-barangay/${id}`);
  },

  /**
   * Create new barangay
   */
  create: async (
    data: CreateBarangayRequest
  ): Promise<ApiResponse<Barangay>> => {
    return apiClient.post("/barangay/add-barangay", data);
  },

  /**
   * Update existing barangay
   */
  update: async (
    id: string,
    data: UpdateBarangayRequest
  ): Promise<ApiResponse<Barangay>> => {
    return apiClient.put(`/barangay/update-barangay/${id}`, data);
  },

  /**
   * Delete barangay
   */
  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/barangay/delete-barangay/${id}`);
  },
};

export default barangayService;
