import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { barangayService } from "@/services/api/barangay.service";

/**
 * Hook to fetch all barangays
 */
export const useBarangays = () => {
  return useQuery({
    queryKey: queryKeys.barangay.all,
    queryFn: barangayService.getAll,
  });
};

export default useBarangays;
