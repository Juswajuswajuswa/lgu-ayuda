import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import type { OtpRequest } from "@/schema/api/auth";

/**
 * Hook for resend OTP mutation
 */
export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (data: OtpRequest) => authService.resendOtp(data),
    onSuccess: (response) => {
      toast.success(response.message || "OTP resent successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    },
  });
};

export default useResendOtpMutation;
