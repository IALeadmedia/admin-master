import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useQuery } from "@tanstack/react-query";

export function usePartnerQuery({
  enabled = true,
  companyId,
  segmentId,
  partnerId,
}: {
  enabled?: boolean;
  companyId?: number;
  segmentId?: string;
  partnerId?: number;
} = {}) {
  const entity = dictionaryQueryClient["partners"];
  const { user } = useAuth();
  const { selectedCompanyId, selectedSegmentId } = useAdminScope();

  const resolvedSegmentId = segmentId ?? selectedSegmentId;
  const resolvedCompanyId = companyId ?? selectedCompanyId;
  const resolvedPartnerId = partnerId ?? undefined;

  const filters = isAdminDomain
    ? {
        ...(resolvedSegmentId ? { segment: resolvedSegmentId } : {}),
        ...(resolvedCompanyId != null ? { company_id: resolvedCompanyId } : {}),
        ...(resolvedPartnerId != null ? { partner_id: resolvedPartnerId } : {}),
      }
    : {
        company_id: user?.user.company_id ?? undefined,
        ...(resolvedPartnerId != null ? { partner_id: resolvedPartnerId } : {}),
      };

  return useQuery({
    queryKey: [
      entity.key,
      filters.segment ?? null,
      filters.company_id ?? null,
      filters.partner_id ?? null,
    ],
    queryFn: () => entity.service.getAll(filters),
    retry: 2,
    enabled,
  });
}
