import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import type { IUserFilters } from "@/types/IUser.type";
import { useQuery } from "@tanstack/react-query";

export function useUserQuery({
  page = 1,
  per_page = 20,
}: {
  page?: number;
  per_page?: number;
} = {}) {
  const entity = dictionaryQueryClient["users"];
  const { user } = useAuth();
  const { selectedCompanyId, selectedPartnerId, selectedSegmentId } =
    useAdminScope();

  const companyId = user?.user.company_id;
  const partnerId = user?.user.partner_id;

  const filters: IUserFilters = isAdminDomain
    ? {
        ...(selectedSegmentId ? { segment: selectedSegmentId } : {}),
        ...(selectedCompanyId != null ? { company_id: selectedCompanyId } : {}),
        ...(selectedPartnerId != null ? { partner_id: selectedPartnerId } : {}),
        page,
        per_page,
      }
    : {
        ...(companyId != null ? { company_id: companyId } : {}),
        ...(partnerId != null ? { partner_id: partnerId } : {}),
        page,
        per_page,
      };

  return useQuery({
    queryKey: [
      entity.key,
      filters.segment ?? null,
      filters.company_id ?? null,
      filters.partner_id ?? null,
      page,
      per_page,
    ],
    queryFn: () => entity.service.getAll(filters),
    retry: 2,
  });
}
