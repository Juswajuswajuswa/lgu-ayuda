import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { authService } from "@/services/api/auth.service";

/**
 * Hook to check if admin exists in the system
 */
export const useCheckAdmin = () => {
  return useQuery({
    queryKey: queryKeys.auth.admin,
    queryFn: authService.checkAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useCheckAdmin;
