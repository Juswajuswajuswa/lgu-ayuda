import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-client/keys";
import { applicationService } from "@/services/api/application.service";
import type { CreateApplicationRequest } from "@/schema/api/application";
import { toast } from "sonner";

/**
 * Hook to create application
 */
export const useCreateApplicationMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: applicationService.create,
    onSuccess: () => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({ queryKey: queryKeys.application.all });
      // Invalidate beneficiaries list as isApplied status changes
      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });

      toast.success("Application created successfully");
      // Redirect to applications list
      router.push("/dashboard/applications");
    },
  });
};

export default useCreateApplicationMutation;
