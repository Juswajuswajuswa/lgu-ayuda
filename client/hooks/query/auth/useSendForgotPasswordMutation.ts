import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import type { ForgotPasswordRequest } from "@/schema/api/auth";

/**
 * Hook for forgot password mutation
 */
export const useSendForgotPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.sendForgotPassword(data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Verification code sent");
      router.push(
        `/verify-otp?forgot-password&email=${encodeURIComponent(
          variables.email
        )}`
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to send verification code";
      toast.error(errorMessage);
    },
  });
};

export default useSendForgotPasswordMutation;
