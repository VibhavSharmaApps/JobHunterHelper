import { useQuery } from "@tanstack/react-query";
import type { Application } from "@shared/schema";

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });
}
