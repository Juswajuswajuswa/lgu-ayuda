import { queryKeys } from "@/lib/query-client/keys";
import { UpdateProjectInput } from "@/schema/api/projects";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateProjectsMutation = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectInput) => projectsService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "Projects updated sucessfullly");

      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.project.detail(id) });

      router.push("/dashboard/projects");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to update");
    },
  });
};

export default useUpdateProjectsMutation;
