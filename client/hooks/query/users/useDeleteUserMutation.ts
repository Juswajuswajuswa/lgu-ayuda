import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usersService } from "@/services/api/users.service";
import { queryKeys } from "@/lib/query-client/keys";

/**
 * Hook to delete user
 */
export const useDeleteUserMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "User deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

      router.push("/dashboard/staff");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete user");
    },
  });
};

export default useDeleteUserMutation;
