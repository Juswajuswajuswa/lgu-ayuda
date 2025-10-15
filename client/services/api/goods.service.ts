import { apiClient } from "./client";
import type {
  Goods,
  CreateGoodsRequest,
  UpdateGoodsRequest,
  GetGoodsResponse,
  GetGoodResponse,
  MutateGoodsResponse,
} from "@/schema/api/goods";

/**
 * Goods API service
 */

export const goodsService = {
  /**
   * Get all goods
   */
  getAll: async (): Promise<GetGoodsResponse> => {
    return apiClient.get("/goods/get-goods");
  },

  /**
   * Get single goods by ID
   */
  getById: async (id: string): Promise<GetGoodResponse> => {
    return apiClient.get(`/goods/get-good/${id}`);
  },

  /**
   * Create new goods
   */
  create: async (data: CreateGoodsRequest): Promise<MutateGoodsResponse> => {
    return apiClient.post("/goods/register-goods", data);
  },

  /**
   * Update existing goods
   */
  update: async (
    id: string,
    data: UpdateGoodsRequest
  ): Promise<MutateGoodsResponse> => {
    return apiClient.put(`/goods/update-goods/${id}`, data);
  },

  /**
   * Delete goods
   */
  delete: async (id: string): Promise<MutateGoodsResponse> => {
    return apiClient.delete(`/goods/delete-goods/${id}`);
  },
};

export default goodsService;
