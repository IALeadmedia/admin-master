import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { TelecomOrderFilters, TelecomOrderResponse } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
import type { OrderModule } from "@/services/orders.service";

/**
 * Busca todos os pedidos de um segmento sem filtrar por operadora/empresa.
 * Usado EXCLUSIVAMENTE pela versão admin quando apenas o segmento está selecionado.
 * Rota chamada: GET /{module}/orders
 */
export function useAllSegmentOrdersQuery({
  module,
  filters,
  enabled = true,
  page = 1,
  per_page = 100,
}: {
  module?: OrderModule;
  filters?: Omit<TelecomOrderFilters, "company_id" | "partner_id">;
  enabled?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  const entity = dictionaryQueryClient.orders;

  return useQuery({
    queryKey: [
      entity.key,
      "all-segment",
      module ?? null,
      filters ?? null,
      page,
      per_page,
    ],
    queryFn: () =>
      entity.service.getAllBySegment<TelecomOrderResponse>(module!, {
        ...filters,
        page,
        per_page,
      }),
    retry: 2,
    enabled: enabled && !!module,
  });
}
