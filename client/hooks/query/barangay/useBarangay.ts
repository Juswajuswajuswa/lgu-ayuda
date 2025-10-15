import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { barangayService } from "@/services/api/barangay.service";

/**
 * Hook to fetch a single barangay by ID
 */
export const useBarangay = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.barangay.detail(id),
    queryFn: () => barangayService.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
};

export default useBarangay;
