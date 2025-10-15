import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { goodsService } from "@/services/api/goods.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { UpdateGoodsRequest } from "@/schema/api/goods";

/**
 * Hook to update existing goods
 */
export const useUpdateGoodsMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGoodsRequest) => goodsService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Goods updated successfully");

      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: queryKeys.goods.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goods.detail(id) });

      router.push("/dashboard/goods");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to update goods");
      }
    },
  });
};

export default useUpdateGoodsMutation;
