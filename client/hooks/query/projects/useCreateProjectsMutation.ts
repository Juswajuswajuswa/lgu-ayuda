"use client";

import { queryKeys } from "@/lib/query-client/keys";
import { CreateProjectInput } from "@/schema/api/projects";
import { projectsService } from "@/services/projects.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateProjectsMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectsService.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "Goods created successfully");

      queryClient.invalidateQueries({ queryKey: queryKeys.project.all });

      router.push("/dashboard/projects");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export default useCreateProjectsMutation;
