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
  companyId: companyIdOverride,
}: {
  model?: ProductModel;
  filters?: Omit<IProductFilters, "company_id">;
  enabled?: boolean;
  page?: number;
  per_page?: number;
  /** Sobrepõe o company_id resolvido internamente. Útil quando se edita um
   *  pedido de uma empresa diferente da selecionada no scope atual. */
  companyId?: number;
} = {}) {
  const entity = dictionaryQueryClient["products"];
  const { user } = useAuth();
  const { selectedSegmentId, selectedCompanyId } = useAdminScope();

  const resolvedModel =
    model ??
    (isProductModel(selectedSegmentId) ? selectedSegmentId : "telecom");

  const companyId = user?.user.company_id;

  const resolvedCompanyId =
    companyIdOverride ??
    (isAdminDomain ? (selectedCompanyId ?? undefined) : companyId);

  const queryFilters: IProductFilters = {
    ...filters,
    ...(resolvedCompanyId != null ? { company_id: resolvedCompanyId } : {}),
    page,
    per_page,
  };

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModel,
      resolvedCompanyId ?? null,
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
