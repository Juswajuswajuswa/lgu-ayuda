import { queryKeys } from "@/lib/query-client/keys";
import { UpdateTodoProjectInput } from "@/schema/api/projects";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface updateTodoVariable {
  id: string;
  todoId: string;
  data: UpdateTodoProjectInput;
}

export const useUpdateProjectTodoStatusMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, todoId, data }: updateTodoVariable) =>
      projectsService.updateStatus(id, todoId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Todo Created Successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });

      // Now you can use `variables.id` to invalidate the specific project
      queryClient.invalidateQueries({
        queryKey: queryKeys.project.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project.detail(variables.todoId),
      });

      router.push(`/dashboard/projects`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export default useUpdateProjectTodoStatusMutation;
