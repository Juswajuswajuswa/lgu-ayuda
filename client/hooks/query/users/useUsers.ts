import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client/keys";
import { usersService } from "@/services/api/users.service";

/**
 * Hook to fetch all users/staff
 */
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: usersService.getAll,
  });
};

export default useUsers;
