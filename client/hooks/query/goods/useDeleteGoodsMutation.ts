import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { goodsService } from "@/services/api/goods.service";
import { queryKeys } from "@/lib/query-client/keys";

/**
 * Hook to delete goods
 */
export const useDeleteGoodsMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goodsService.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "Goods deleted successfully");

      // Invalidate goods list
      queryClient.invalidateQueries({ queryKey: queryKeys.goods.all });

      router.push("/dashboard/goods");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete goods");
    },
  });
};

export default useDeleteGoodsMutation;
