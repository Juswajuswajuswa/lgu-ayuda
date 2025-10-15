import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import type { VerifyOtpRequest } from "@/schema/api/auth";

/**
 * Hook for verify OTP mutation
 */
export const useVerifyOtpMutation = (
  onSuccessCallback?: (email: string) => void
) => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "OTP verified successfully");
      if (onSuccessCallback) {
        onSuccessCallback(variables.email);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Invalid OTP";
      toast.error(errorMessage);
    },
  });
};

export default useVerifyOtpMutation;
