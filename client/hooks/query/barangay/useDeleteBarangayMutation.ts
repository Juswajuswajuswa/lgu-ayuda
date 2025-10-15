import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { barangayService } from "@/services/api/barangay.service";
import { queryKeys } from "@/lib/query-client/keys";

/**
 * Hook to delete barangay
 */
export const useDeleteBarangayMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => barangayService.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "Barangay deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.barangay.all });

      router.push("/dashboard/barangay");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete barangay");
    },
  });
};

export default useDeleteBarangayMutation;
