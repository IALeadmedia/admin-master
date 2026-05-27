import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";
import type { AnyOrderResponse } from "@/types/orders";
type DeleteOrderMutationVariables = {
  ids: number[];
};

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient.orders;
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope();

  return useMutation({
    mutationFn: async ({ ids }: DeleteOrderMutationVariables) => {
      await Promise.all(
        ids.map((id) =>
          entity.service.delete(id, resolvedModule, resolvedOperator),
        ),
      );
    },
    onMutate: async ({ ids }: DeleteOrderMutationVariables) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<AnyOrderResponse>({
        queryKey: [entity.key],
      });

      queryClient.setQueriesData<AnyOrderResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;

          const idsSet = new Set(ids);
          const nextOrders = old.orders.filter(
            (order) => !idsSet.has(order.id),
          );
          const removedCount = old.orders.length - nextOrders.length;

          return {
            ...old,
            orders: nextOrders,
            total: Math.max((old.total ?? old.orders.length) - removedCount, 0),
          };
        },
      );

      return { previousQueries, toastId: fb.deleteLoading(entity, ids.length) };
    },
    onError: (_err, _variables, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });

      if (context?.toastId)
        fb.deleteSuccess(entity, _variables.ids.length, context.toastId);
    },
  });
}
