import { apiClient } from "./client";
import type {
  Application,
  GetApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from "@/schema/api/application";
import type { ApiResponse } from "./types";

/**
 * Application API service
 */
export const applicationService = {
  /**
   * Get all applications
   */
  getAll: async (): Promise<GetApplicationsResponse> => {
    return apiClient.get("/application/get-applications");
  },

  /**
   * Update application status
   */
  updateStatus: async (
    id: string,
    data: UpdateApplicationStatusRequest
  ): Promise<UpdateApplicationStatusResponse> => {
    return apiClient.post(`/application/update-status/${id}`, data);
  },

  /**
   * Create application
   */
  create: async (
    data: CreateApplicationRequest
  ): Promise<CreateApplicationResponse> => {
    return apiClient.post("/application/apply-application", data);
  },
};

export default applicationService;
