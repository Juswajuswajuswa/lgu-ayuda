import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { usersService } from "@/services/api/users.service";

/**
 * Hook to fetch a single user by ID
 */
export const useUser = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
};

export default useUser;
