import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { beneficiaryService } from "@/services/api/beneficiary.service";

/**
 * Hook to fetch a single beneficiary by ID
 */
export const useBeneficiary = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.beneficiary.detail(id),
    queryFn: () => beneficiaryService.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
};

export default useBeneficiary;
