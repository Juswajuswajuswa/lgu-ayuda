import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import { useAuthStore } from "@/stores/slices/auth";
import { queryKeys } from "@/lib/query-client/keys";
import type { LoginRequest } from "@/schema/api/auth";

/**
 * Hook for user login mutation
 */
export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Login successful");
      router.push("/dashboard");
      if (response.success && response.user) {
        setUser(response.user as any);
        // Invalidate auth-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export default useLoginMutation;
