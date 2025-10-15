"use client";

import { queryKeys } from "@/lib/query-client/keys";
import { CreateProjectTodoInput } from "@/schema/api/projects";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddTodoVariables {
  id: string;
  data: CreateProjectTodoInput;
}

export const useCreateProjectTodoMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: AddTodoVariables) =>
      projectsService.addTodo(id, data),

    // The key is to accept the `variables` parameter here
    onSuccess: (response, variables) => {
      toast.success(response.message || "Todo Created Successfully");

      // Invalidate the list of all projects
      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });

      // Now you can use `variables.id` to invalidate the specific project
      queryClient.invalidateQueries({
        queryKey: queryKeys.project.detail(variables.id),
      });

      // Suggestion: Redirect back to the project detail page to see the new todo
      router.push(`/dashboard/projects`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    },
  });
};
