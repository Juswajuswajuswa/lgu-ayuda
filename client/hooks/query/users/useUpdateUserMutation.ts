import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usersService } from "@/services/api/users.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { UpdateUserRequest } from "@/schema/api/users";

/**
 * Hook to update existing user
 */
export const useUpdateUserMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "User updated successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });

      router.push("/dashboard/staff");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to update user");
      }
    },
  });
};

export default useUpdateUserMutation;
