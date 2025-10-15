import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import { ayudaService } from "@/services/api/ayuda.service";
import { ApiResponse } from "@/services/api/types";
import { Ayuda } from "@/schema/api/ayuda";

/**
 * Hook to delete ayuda
 */
export const useDeleteAyudaMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ayudaService.delete(id),
    onSuccess: (response: ApiResponse<Ayuda>) => {
      toast.success(response.message || "Ayuda deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.ayuda.all });

      router.push("/dashboard/ayuda");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete ayuda");
    },
  });
};

export default useDeleteAyudaMutation;
