import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { distributionService } from "@/services/api/distribution.service";
import { toast } from "sonner";

export const useUpdateDistributionStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "claimed" | "unclaimed";
    }) => distributionService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.distribution.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });
      toast.success("Distribution status updated successfully");
    },
  });
};

export default useUpdateDistributionStatusMutation;
