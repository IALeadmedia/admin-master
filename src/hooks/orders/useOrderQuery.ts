import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { IOrderTelecomFilters } from "@/types/IOrder.type";
import { useQuery } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";
import type { OrderModule } from "@/services/orders.service";

export function useOrderQuery({
  model,
  filters,
  enabled = true,
}: {
  model?: OrderModule;
  filters?: Omit<IOrderTelecomFilters, "company_id" | "partner_id">;
  enabled?: boolean;
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
  };

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModule,
      resolvedOperator,
      resolvedFilters.company_id ?? null,
      resolvedFilters.partner_id ?? null,
      filters ?? null,
    ],
    queryFn: () =>
      entity.service.getAll(resolvedModule, resolvedOperator, resolvedFilters),
    retry: 2,
    enabled,
  });
}
