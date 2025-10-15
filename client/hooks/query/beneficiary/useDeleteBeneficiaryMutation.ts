import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import beneficiaryService from "@/services/api/beneficiary.service";

/**
 * Hook to delete (archive) a beneficiary
 */
export const useDeleteBeneficiaryMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => beneficiaryService.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "Beneficiary deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });

      router.push("/dashboard/beneficiaries");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete beneficiary");
    },
  });
};

export default useDeleteBeneficiaryMutation;
