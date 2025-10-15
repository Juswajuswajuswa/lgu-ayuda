import { z } from "zod";
import { mongoIdSchema, timestampSchema } from "../common/base";

// Goods entity
export const goodsSchema = z.object({
  _id: mongoIdSchema,
  product: z.object({
    name: z.string(),
    details: z.string(),
  }),
  quantity: z.number().int().nonnegative(),
  ...timestampSchema.shape,
});

// Create goods request
export const createGoodsRequestSchema = z.object({
  product: z.object({
    name: z.string().min(1, "Product name is required"),
    details: z.string().min(1, "Product details are required"),
  }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Update goods request
export const updateGoodsRequestSchema = createGoodsRequestSchema;

// Get goods response
export const getGoodsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(goodsSchema),
});

// Get single good response
export const getGoodResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  goods: goodsSchema,
});

// Create/Update goods response
export const mutateGoodsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: goodsSchema.optional(),
});

// Type exports
export type Goods = z.infer<typeof goodsSchema>;
export type CreateGoodsRequest = z.infer<typeof createGoodsRequestSchema>;
export type UpdateGoodsRequest = z.infer<typeof updateGoodsRequestSchema>;
export type GetGoodsResponse = z.infer<typeof getGoodsResponseSchema>;
export type GetGoodResponse = z.infer<typeof getGoodResponseSchema>;
export type MutateGoodsResponse = z.infer<typeof mutateGoodsResponseSchema>;
