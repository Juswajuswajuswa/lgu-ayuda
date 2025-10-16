import { queryKeys } from "@/lib/query-client/keys";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: (response) => {
      toast.success(response.message || "Project deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
};
