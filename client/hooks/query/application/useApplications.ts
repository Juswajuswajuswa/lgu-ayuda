import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { applicationService } from "@/services/api/application.service";

/**
 * Hook to fetch all applications
 */
export const useApplications = () => {
  return useQuery({
    queryKey: queryKeys.application.all,
    queryFn: applicationService.getAll,
  });
};

export default useApplications;
