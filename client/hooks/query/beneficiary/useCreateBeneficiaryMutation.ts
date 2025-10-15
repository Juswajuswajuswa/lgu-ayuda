import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateBeneficiaryRequest } from "@/schema/api/beneficiary";
import beneficiaryService from "@/services/api/beneficiary.service";

/**
 * Hook to create new beneficiary
 */
export const useCreateBeneficiaryMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBeneficiaryRequest) =>
      beneficiaryService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Beneficiary created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });

      router.push("/dashboard/beneficiaries");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create beneficiary");
      }
    },
  });
};

export default useCreateBeneficiaryMutation;
