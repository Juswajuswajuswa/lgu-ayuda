import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { applicationService } from "@/services/api/application.service";
import type { UpdateApplicationStatusRequest } from "@/schema/api/application";
import { toast } from "sonner";

/**
 * Hook to update application status
 */
export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationService.updateStatus(id, {
        status,
      } as UpdateApplicationStatusRequest),
    onSuccess: () => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({ queryKey: queryKeys.application.all });
      toast.success("Application status updated successfully");
    },
  });
};

export default useUpdateApplicationStatusMutation;
