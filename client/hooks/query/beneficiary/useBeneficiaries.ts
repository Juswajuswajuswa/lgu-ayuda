import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { beneficiaryService } from "@/services/api/beneficiary.service";

/**
 * Hook to fetch all beneficiaries
 */
export const useBeneficiaries = () => {
  return useQuery({
    queryKey: queryKeys.beneficiary.all,
    queryFn: beneficiaryService.getAll,
  });
};

export default useBeneficiaries;
