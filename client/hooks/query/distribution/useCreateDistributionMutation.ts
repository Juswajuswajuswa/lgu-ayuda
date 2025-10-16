import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-client/keys";
import { distributionService } from "@/services/api/distribution.service";
import type { CreateDistributionRequest } from "@/schema/api/distribution";
import { toast } from "sonner";

/**
 * Hook to create distribution
 */
export const useCreateDistributionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: distributionService.create,
    onSuccess: () => {
      // Invalidate and refetch distributions list
      queryClient.invalidateQueries({ queryKey: queryKeys.distribution.all });
      // Invalidate applications list as status changes
      queryClient.invalidateQueries({ queryKey: queryKeys.application.all });
      // Invalidate beneficiaries list as status changes
      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });

      toast.success("Distribution created successfully");
      // Redirect to distributions list
      router.push("/dashboard/distributions");
    },
  });
};

export default useCreateDistributionMutation;
