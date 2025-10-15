import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client/keys";
import type { UpdateAyudaRequest } from "@/schema/api/ayuda";
import { ayudaService } from "@/services/api/ayuda.service";

/**
 * Hook to update existing ayuda
 */
export const useUpdateAyudaMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAyudaRequest) => ayudaService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Ayuda updated successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.ayuda.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ayuda.detail(id),
      });

      router.push("/dashboard/ayuda");
    },
    onError: (error: any) => {
      const serverError = error?.errors;

      if (serverError) {
        Object.entries(serverError).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error?.message || "Failed to update ayuda");
      }
    },
  });
};

export default useUpdateAyudaMutation;
