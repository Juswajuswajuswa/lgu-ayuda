import { apiClient } from "./client";
import type {
  Ayuda,
  CreateAyudaRequest,
  GetAyudasResponse,
  GetAyudaResponse,
  UpdateAyudaRequest,
} from "@/schema/api/ayuda";
import type { ApiResponse } from "./types";

/**
 * Ayuda API service
 */

export const ayudaService = {
  /**
   * Get all ayudas
   */
  getAll: async (): Promise<GetAyudasResponse> => {
    return apiClient.get("/ayuda/get-ayudas");
  },

  /**
   * Get single ayuda by ID
   */
  getById: async (id: string): Promise<GetAyudaResponse> => {
    return apiClient.get(`/ayuda/get-ayuda/${id}`);
  },

  /**
   * Create new ayuda
   */
  create: async (data: CreateAyudaRequest): Promise<ApiResponse<Ayuda>> => {
    return apiClient.post("/ayuda/register-ayuda", data);
  },

  /**
   * Update existing ayuda
   */
  update: async (
    id: string,
    data: UpdateAyudaRequest
  ): Promise<ApiResponse<Ayuda>> => {
    return apiClient.put(`/ayuda/update-ayuda/${id}`, data);
  },

  /**
   * Delete ayuda
   */
  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/ayuda/delete-ayuda/${id}`);
  },
};

export default ayudaService;
