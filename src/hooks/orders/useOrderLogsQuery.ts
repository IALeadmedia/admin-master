import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { OrdersService, type OrderModule } from "@/services/orders.service";
import type { OrderLogsResponse } from "@/types/orders";

export const useOrderLogsQuery = (
  id: number,
  module: OrderModule,
  operator: string,
  enabled: boolean = true,
): UseQueryResult<OrderLogsResponse, Error> => {
  return useQuery({
    queryKey: ["orderLogs", id, module, operator],
    queryFn: () => OrdersService.getLogById(id, module, operator),
    enabled,
  });
};
