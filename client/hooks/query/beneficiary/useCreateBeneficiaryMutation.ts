import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateBeneficiaryRequest } from "@/schema/api/beneficiary";
import beneficiaryService from "@/services/api/beneficiary.service";

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Hook to create new beneficiary
 */
export const useCreateBeneficiaryMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Convert File to base64 if validId is a File
      if (data.validId instanceof File) {
        const base64 = await fileToBase64(data.validId);
        data = { ...data, validId: base64 };
      }
      return beneficiaryService.create(data as CreateBeneficiaryRequest);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Beneficiary created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.beneficiary.all });

      router.push("/dashboard/beneficiaries");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create beneficiary");
      }
    },
  });
};

export default useCreateBeneficiaryMutation;
