import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import type { UpdateBeneficiaryRequest } from "@/schema/api/beneficiary";
import beneficiaryService from "@/services/api/beneficiary.service";

/**
 * Hook to update a beneficiary
 */
export const useUpdateBeneficiaryMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBeneficiaryRequest) =>
      beneficiaryService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Beneficiary updated successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.beneficiary.detail(id),
      });

      router.push("/dashboard/beneficiaries");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to update beneficiary");
      }
    },
  });
};

export default useUpdateBeneficiaryMutation;
