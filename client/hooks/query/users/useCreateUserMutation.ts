import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usersService } from "@/services/api/users.service";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateUserRequest } from "@/schema/api/users";

/**
 * Hook to create new user/staff
 */
export const useCreateUserMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "User created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

      router.push("/dashboard/staff");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create user");
      }
    },
  });
};

export default useCreateUserMutation;
