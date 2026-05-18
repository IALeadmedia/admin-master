import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { isProductModel } from "@/services/products.service";
import { useQuery } from "@tanstack/react-query";
import type { IProductFilters, ProductModel } from "@/types/IProduct.type";

export function useProductQuery({
  model,
  filters,
  enabled = true,
}: {
  model?: ProductModel;
  filters?: Omit<IProductFilters, "company_id" | "partner_id">;
  enabled?: boolean;
} = {}) {
  const entity = dictionaryQueryClient["products"];
  const { user } = useAuth();
  const { selectedSegmentId, selectedCompanyId, selectedPartnerId } =
    useAdminScope();

  const resolvedModel =
    model ??
    (isProductModel(selectedSegmentId) ? selectedSegmentId : "telecom");

  const companyId = user?.user.company_id;
  const partnerId = user?.user.partner_id;

  const queryFilters: IProductFilters = isAdminDomain
    ? {
        ...filters,
        ...(selectedCompanyId != null ? { company_id: selectedCompanyId } : {}),
        ...(selectedPartnerId != null ? { partner_id: selectedPartnerId } : {}),
      }
    : {
        ...filters,
        ...(companyId != null ? { company_id: companyId } : {}),
        ...(partnerId != null ? { partner_id: partnerId } : {}),
      };

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModel,
      queryFilters.company_id ?? null,
      queryFilters.partner_id ?? null,
      queryFilters.category ?? null,
      queryFilters.page ?? null,
      queryFilters.perPage ?? null,
    ],
    queryFn: () => entity.service.getAll(queryFilters, resolvedModel),
    retry: 2,
    enabled,
  });
}
