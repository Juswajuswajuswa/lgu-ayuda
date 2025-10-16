import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { distributionService } from "@/services/api/distribution.service";

/**
 * Hook to fetch all distributions
 */
export const useDistributions = () => {
  return useQuery({
    queryKey: queryKeys.distribution.all,
    queryFn: distributionService.getAll,
  });
};

export default useDistributions;
