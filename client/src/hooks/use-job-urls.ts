import { useQuery } from "@tanstack/react-query";
import type { JobUrl } from "@shared/schema";

export function useJobUrls() {
  return useQuery<JobUrl[]>({
    queryKey: ["/api/job-urls"],
  });
}
