import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { IOrderTelecomFilters } from "@/types/IOrder.type";
import { useQuery } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";
import type { OrderModule } from "@/services/orders.service";

export function useOrderQuery({
  model,
  filters,
  enabled = true,
  page = 1,
  per_page = 20,
}: {
  model?: OrderModule;
  filters?: Omit<IOrderTelecomFilters, "company_id" | "partner_id">;
  enabled?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  const entity = dictionaryQueryClient.orders;
  const {
    resolvedModule,
    resolvedOperator,
    resolvedCompanyId,
    resolvedPartnerId,
  } = useResolvedOrderScope(model);

  const resolvedFilters: IOrderTelecomFilters = {
    ...filters,
    ...(resolvedCompanyId != null ? { company_id: resolvedCompanyId } : {}),
    ...(resolvedPartnerId != null ? { partner_id: resolvedPartnerId } : {}),
    page,
    per_page,
  };

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModule,
      resolvedOperator,
      resolvedFilters.company_id ?? null,
      resolvedFilters.partner_id ?? null,
      filters ?? null,
      page,
      per_page,
    ],
    queryFn: () =>
      entity.service.getAll(resolvedModule, resolvedOperator, resolvedFilters),
    retry: 2,
    enabled,
  });
}
