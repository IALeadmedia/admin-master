import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type { IOrderTelecomResponse } from "@/types/IOrder.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";

type DeleteOrderMutationVariables = {
  id: number;
};

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient.orders;
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope();

  return useMutation({
    mutationFn: ({ id }: DeleteOrderMutationVariables) =>
      entity.service.delete(id, resolvedModule, resolvedOperator),
    onMutate: async ({ id }: DeleteOrderMutationVariables) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<IOrderTelecomResponse>(
        {
          queryKey: [entity.key],
        },
      );

      queryClient.setQueriesData<IOrderTelecomResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;

          const nextOrders = old.orders.filter((order) => order.id !== id);
          const removedCount = old.orders.length - nextOrders.length;

          return {
            ...old,
            orders: nextOrders,
            total: Math.max((old.total ?? old.orders.length) - removedCount, 0),
          };
        },
      );

      return { previousQueries, toastId: fb.deleteLoading(entity, 1) };
    },
    onError: (_err, _variables, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });

      if (context?.toastId) fb.deleteSuccess(entity, 1, context.toastId);
    },
  });
}
