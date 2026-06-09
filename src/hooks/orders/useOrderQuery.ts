import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { TelecomOrderFilters, TelecomOrderResponse } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";
import type { OrderModule } from "@/services/orders.service";
import type { AnyOrderFilters, AnyOrderResponse } from "@/types/orders";
export function useOrderQuery<
  TFilters extends AnyOrderFilters = TelecomOrderFilters,
  TResponse extends AnyOrderResponse = TelecomOrderResponse,
>({
  model,
  filters,
  enabled = true,
  page = 1,
  per_page = 100,
}: {
  model?: OrderModule;
  filters?: TFilters;
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

  const resolvedFilters = {
    ...filters,
    ...(resolvedCompanyId != null ? { company_id: resolvedCompanyId } : {}),
    ...(resolvedPartnerId != null ? { partner_id: resolvedPartnerId } : {}),
    page,
    per_page,
  } as TFilters;

  return useQuery({
    queryKey: [
      entity.key,
      resolvedModule,
      resolvedOperator ?? null,
      resolvedFilters.company_id ?? null,
      resolvedFilters.partner_id ?? null,
      filters ?? null,
      page,
      per_page,
    ],
    queryFn: () =>
      resolvedOperator
        ? entity.service.getAll<TResponse>(
            resolvedModule,
            resolvedOperator,
            resolvedFilters,
          )
        : entity.service.getAllBySegment<TResponse>(
            resolvedModule,
            resolvedFilters,
          ),
    retry: 2,
    enabled,
  });
}
