import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import type { PasswordResetRequest } from "@/schema/api/auth";
import { useRouter } from "next/navigation";

/**
 * Hook for verify OTP mutation
 */
export const usePasswordReset = (
  onSuccessCallback?: (email: string) => void
) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PasswordResetRequest) => authService.passwordReset(data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Password reset successfully");
      if (onSuccessCallback) {
        onSuccessCallback(variables.email);
      }

      router.push("/login");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Invalid password";
      toast.error(errorMessage);
    },
  });
};

export default usePasswordReset;
