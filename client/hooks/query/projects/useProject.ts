import { queryKeys } from "@/lib/query-client/keys";
import { projectsService } from "@/services/projects.service";
import { useQuery } from "@tanstack/react-query";

export const useProject = (id: string, options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: queryKeys.project.detail(id),
    queryFn: () => projectsService.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
};
