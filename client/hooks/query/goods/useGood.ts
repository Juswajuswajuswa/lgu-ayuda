import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { goodsService } from "@/services/api/goods.service";

/**
 * Hook to fetch a single goods item by ID
 */
export const useGood = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.goods.detail(id),
    queryFn: () => goodsService.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
};

export default useGood;
