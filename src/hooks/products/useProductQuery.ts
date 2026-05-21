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
  page = 1,
  per_page = 20,
}: {
  model?: ProductModel;
  filters?: Omit<IProductFilters, "company_id">;
  enabled?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  const entity = dictionaryQueryClient["products"];
  const { user } = useAuth();
  const { selectedSegmentId, selectedCompanyId } = useAdminScope();

  const resolvedModel =
    model ??
    (isProductModel(selectedSegmentId) ? selectedSegmentId : "telecom");

  const companyId = user?.user.company_id;

  const queryFilters: IProductFilters = isAdminDomain
    ? {
        ...filters,
        ...(selectedCompanyId != null ? { company_id: selectedCompanyId } : {}),
        page,
        per_page,
      }
    : {
        ...filters,
        ...(companyId != null ? { company_id: companyId } : {}),
        page,
        per_page,
      };

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModel,
      queryFilters.company_id ?? null,
      queryFilters.category ?? null,
      queryFilters.page ?? null,
      queryFilters.perPage ?? null,
      page,
      per_page,
    ],
    queryFn: () => entity.service.getAll(queryFilters, resolvedModel),
    retry: 2,
    enabled,
  });
}
