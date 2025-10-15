import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import { useAuthStore } from "@/stores/slices/auth";

/**
 * Hook for user logout mutation
 */
export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: (response) => {
      logout();

      // Clear all cached queries
      queryClient.clear();

      toast.success(response.message || "Logged out successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Logout failed");
    },
  });
};

export default useLogoutMutation;
