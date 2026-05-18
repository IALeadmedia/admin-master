import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import type { ICompanyFilters } from "@/types/ICompany.type";
import { useQuery } from "@tanstack/react-query";

export function useCompanyQuery({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const entity = dictionaryQueryClient["companies"];
  const { selectedSegmentId } = useAdminScope();

  const filters: ICompanyFilters = isAdminDomain
    ? {
        ...(selectedSegmentId ? { segment: selectedSegmentId } : {}),
      }
    : {};

  return useQuery({
    queryKey: [entity.key, filters.segment ?? null],
    queryFn: () => entity.service.getAll(filters),
    retry: 2,
    enabled,
  });
}
