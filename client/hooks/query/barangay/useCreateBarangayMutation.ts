import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { barangayService } from "@/services/api/barangay.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateBarangayRequest } from "@/schema/api/barangay";

/**
 * Hook to create new barangay
 */
export const useCreateBarangayMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBarangayRequest) => barangayService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Barangay created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.barangay.all });

      router.push("/dashboard/barangay");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create barangay");
      }
    },
  });
};

export default useCreateBarangayMutation;
