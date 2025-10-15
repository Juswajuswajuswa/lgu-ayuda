import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { goodsService } from "@/services/api/goods.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateGoodsRequest } from "@/schema/api/goods";

/**
 * Hook to create new goods
 */
export const useCreateGoodsMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoodsRequest) => goodsService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Goods created successfully");

      // Invalidate goods list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.goods.all });

      router.push("/dashboard/goods");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        // Display field-specific errors
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create goods");
      }
    },
  });
};

export default useCreateGoodsMutation;
