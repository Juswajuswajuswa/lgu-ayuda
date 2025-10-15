import { z } from "zod";

// Goods form (create/edit)
export const goodsFormSchema = z.object({
  product: z.object({
    name: z.string().min(1, "Product name is required").max(100),
    details: z.string().min(1, "Product details are required").max(500),
  }),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(10000, "Quantity cannot exceed 10,000"),
});

// Type export
export type GoodsFormData = z.infer<typeof goodsFormSchema>;
