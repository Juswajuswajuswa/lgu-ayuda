import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import type { CreateAyudaRequest } from "@/schema/api/ayuda";
import { ayudaService } from "@/services/api/ayuda.service";

/**
 * Hook to create new ayuda
 */
export const useCreateAyudaMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAyudaRequest) => ayudaService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Ayuda created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.ayuda.all });

      router.push("/dashboard/ayuda");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to create ayuda");
      }
    },
  });
};

export default useCreateAyudaMutation;
