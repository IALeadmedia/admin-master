import { useQuery } from "@tanstack/react-query";
import { PartnersPriorityService } from "@/services/partner-priority.service";
import type { IPartnerPriorityFilters } from "@/types/IPartnerPriority.type";

export function usePartnerPriorityQuery(
  filters?: IPartnerPriorityFilters,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [
      "partner-priorities",
      filters?.company_id ?? null,
      filters?.client_type ?? null,
      filters?.uf ?? null,
    ],
    queryFn: () => PartnersPriorityService.getAll(filters),
    retry: 2,
    enabled,
  });
}
