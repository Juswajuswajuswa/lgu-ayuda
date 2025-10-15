import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { ayudaService } from "@/services/api/ayuda.service";

/**
 * Hook to fetch all ayudas
 */
export const useAyudas = () => {
  return useQuery({
    queryKey: queryKeys.ayuda.all,
    queryFn: ayudaService.getAll,
  });
};

export default useAyudas;
