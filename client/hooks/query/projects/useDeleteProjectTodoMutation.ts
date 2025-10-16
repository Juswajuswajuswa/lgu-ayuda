import { queryKeys } from "@/lib/query-client/keys";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface deleteTodoVariable {
  id: string;
  todoId: string;
}

export const useDeleteProjectTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, todoId }: deleteTodoVariable) =>
      projectsService.deleteTodo(id, todoId),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Project deleted successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });

      queryClient.invalidateQueries({
        queryKey: queryKeys.project.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project.detail(variables.todoId),
      });
    },
  });
};
