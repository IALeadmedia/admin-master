import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { OrdersService, type OrderModule } from "@/services/orders.service";
import type { OrderLogsResponse } from "@/types/orders";

export const useOrderLogsQuery = (
  id: number,
  module: OrderModule,
  enabled: boolean = true,
): UseQueryResult<OrderLogsResponse, Error> => {
  return useQuery({
    queryKey: ["orderLogs", id, module],
    queryFn: () => OrdersService.getLogById(id, module),
    enabled,
  });
};
