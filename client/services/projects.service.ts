import {
  CreateProjectInput,
  GetProjectsResponse,
  MutateProjectsResponse,
} from "@/schema/api/projects";
import apiClient from "./api/client";

export const projectsService = {
  create: async (data: CreateProjectInput): Promise<MutateProjectsResponse> => {
    return apiClient.post("/project/add-name", data);
  },

  getAll: async (): Promise<GetProjectsResponse> => {
    return apiClient.get("/project/get-projects");
  },
};
