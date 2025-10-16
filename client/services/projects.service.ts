import {
  CreateProjectInput,
  CreateProjectTodoInput,
  GetProjectsResponse,
  MutateProjectsResponse,
  UpdateProjectInput,
  UpdateTodoProjectInput,
} from "@/schema/api/projects";
import apiClient from "./api/client";

export const projectsService = {
  create: async (data: CreateProjectInput): Promise<MutateProjectsResponse> => {
    return apiClient.post("/project/add-name", data);
  },

  getAll: async (): Promise<GetProjectsResponse> => {
    return apiClient.get("/project/get-projects");
  },

  update: async (id: string, data: UpdateProjectInput) => {
    return apiClient.post(`/project/${id}/update-projectName`, data);
  },

  getById: async (id: string) => {
    return apiClient.get(`/project/get-project/${id}`);
  },

  addTodo: async (id: string, data: CreateProjectTodoInput) => {
    return apiClient.post(`/project/add-todos/${id}`, data);
  },

  updateTodo: async (
    id: string,
    todoId: string,
    data: UpdateTodoProjectInput
  ) => {
    return apiClient.post(`/project/${id}/update-title/${todoId}`, data);
  },

  updateStatus: async (
    id: string,
    todoId: string,
    data: CreateProjectTodoInput
  ) => {
    return apiClient.post(`/project/${id}/update-status/${todoId}`, data);
  },

  deleteTodo: async (
    id: string,
    todoId: string
  ): Promise<MutateProjectsResponse> => {
    return apiClient.delete(`/project/${id}/delete/${todoId}`);
  },

  deleteProject: async (id: string): Promise<MutateProjectsResponse> => {
    return apiClient.delete(`/project/${id}/delete-project`);
  },
};
