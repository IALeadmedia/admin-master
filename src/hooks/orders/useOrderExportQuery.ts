import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useQuery } from "@tanstack/react-query";
import type {
  TelecomOrderFilters,
  FinanceOrderFilters,
  BenefitsOrderFilters,
} from "@/types/orders";
import type { OrderModule } from "@/services/orders.service";

type OrderFilters =
  | TelecomOrderFilters
  | FinanceOrderFilters
  | BenefitsOrderFilters;

export function useOrdersExportQuery({
  module,
  filters,
  enabled = true,
}: {
  module?: OrderModule;
  filters?: OrderFilters;
  enabled?: boolean;
}) {
  const entity = dictionaryQueryClient.orders;

  return useQuery({
    queryKey: [entity.key, "export", module ?? null, filters ?? null],
    queryFn: () => entity.service.getAllOrderExport(module!, filters),
    enabled: enabled && !!module,
    retry: 2,
  });
}
