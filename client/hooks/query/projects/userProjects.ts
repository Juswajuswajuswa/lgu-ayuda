import { queryKeys } from "@/lib/query-client/keys";
import { projectsService } from "@/services/projects.service";

import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.project.all,
    queryFn: projectsService.getAll,
  });
};

export default useProjects;
