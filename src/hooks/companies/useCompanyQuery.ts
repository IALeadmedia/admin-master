import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import type { ICompanyFilters } from "@/types/ICompany.type";
import { useQuery } from "@tanstack/react-query";

export function useCompanyQuery({
  enabled = true,
  page = 1,
  per_page = 20,
}: { enabled?: boolean; page?: number; per_page?: number } = {}) {
  const entity = dictionaryQueryClient["companies"];
  const { selectedSegmentId } = useAdminScope();

  const filters: ICompanyFilters = isAdminDomain
    ? {
        ...(selectedSegmentId ? { segment: selectedSegmentId } : {}),
        page,
        per_page,
      }
    : {};

  return useQuery({
    queryKey: [entity.key, filters.segment ?? null, page, per_page],
    queryFn: () => entity.service.getAll(filters),
    retry: 2,
    enabled,
  });
}
