import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { barangayService } from "@/services/api/barangay.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { UpdateBarangayRequest } from "@/schema/api/barangay";

/**
 * Hook to update existing barangay
 */
export const useUpdateBarangayMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBarangayRequest) =>
      barangayService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Barangay updated successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.barangay.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.barangay.detail(id),
      });

      router.push("/dashboard/barangay");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to update barangay");
      }
    },
  });
};

export default useUpdateBarangayMutation;
