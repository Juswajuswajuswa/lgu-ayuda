import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { ayudaService } from "@/services/api/ayuda.service";

/**
 * Hook to fetch a single ayuda by ID
 */
export const useAyuda = (id: string) => {
  return useQuery({
    queryKey: queryKeys.ayuda.detail(id),
    queryFn: () => ayudaService.getById(id),
  });
};

export default useAyuda;
