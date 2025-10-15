import { apiClient } from "./client";
import type {
  Beneficiary,
  CreateBeneficiaryRequest,
  GetBeneficiariesResponse,
  GetBeneficiaryResponse,
  UpdateBeneficiaryRequest,
} from "@/schema/api/beneficiary";
import type { ApiResponse } from "./types";

/**
 * Beneficiary API service
 */

export const beneficiaryService = {
  /**
   * Get beneficiaries
   */
  getAll: async (): Promise<GetBeneficiariesResponse> => {
    return apiClient.get("/beneficiary/get-beneficiaries");
  },

  /**
   * Get beneficiary
   */
  getById: async (id: string): Promise<GetBeneficiaryResponse> => {
    return apiClient.get(`/beneficiary/get-beneficiary/${id}`);
  },

  /**
   * Create beneficiary
   */
  create: async (
    data: CreateBeneficiaryRequest
  ): Promise<ApiResponse<Beneficiary>> => {
    return apiClient.post("/beneficiary/register-beneficiary", data);
  },

  /**
   * Update beneficiary
   */
  update: async (
    id: string,
    data: UpdateBeneficiaryRequest
  ): Promise<ApiResponse<Beneficiary>> => {
    return apiClient.put(`/beneficiary/update-beneficiary/${id}`, data);
  },

  /**
   * Archive beneficiary
   */
  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.put(`/beneficiary/archive-beneficiary/${id}`);
  },
};

export default beneficiaryService;
