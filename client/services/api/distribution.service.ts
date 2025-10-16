import { apiClient } from "./client";
import type {
  Distribution,
  GetDistributionsResponse,
  CreateDistributionRequest,
  CreateDistributionResponse,
  UpdateDistributionStatusRequest,
} from "@/schema/api/distribution";
import type { ApiResponse } from "./types";

export const distributionService = {
  getAll: async (): Promise<GetDistributionsResponse> => {
    return apiClient.get("/distribute/distributions");
  },

  create: async (
    data: CreateDistributionRequest
  ): Promise<CreateDistributionResponse> => {
    return apiClient.post("/distribute/distribute", data);
  },

  updateStatus: async (
    id: string,
    data: UpdateDistributionStatusRequest
  ): Promise<CreateDistributionResponse> => {
    return apiClient.put(`/distribute/update-status/${id}`, data);
  },

  deleteAll: async (): Promise<ApiResponse> => {
    return apiClient.delete("/distribute/delete-distributions");
  },
};

export default distributionService;
