import { useQuery } from "@tanstack/react-query";
import type { UserPreferences } from "@shared/schema";

export function useUserPreferences() {
  return useQuery<UserPreferences>({
    queryKey: ["/api/user-preferences"],
  });
}
