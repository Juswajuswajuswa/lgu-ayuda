import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { goodsService } from "@/services/api/goods.service";

/**
 * Hook to fetch all goods
 */
export const useGoods = () => {
  return useQuery({
    queryKey: queryKeys.goods.all,
    queryFn: goodsService.getAll,
  });
};

export default useGoods;
