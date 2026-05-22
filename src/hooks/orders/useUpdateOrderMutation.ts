import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type { TelecomOrder, TelecomOrderResponse } from "@/types/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";

type UpdateOrderMutationVariables = {
  id: number;
  payload: Record<string, unknown>;
};

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient.orders;
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateOrderMutationVariables) =>
      entity.service.update(id, resolvedModule, resolvedOperator, payload),
    onMutate: async ({ id, payload }: UpdateOrderMutationVariables) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<TelecomOrderResponse>({
        queryKey: [entity.key],
      });

      queryClient.setQueriesData<TelecomOrderResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            orders: old.orders.map((order: TelecomOrder) =>
              order.id !== id
                ? order
                : ({ ...order, ...payload } as TelecomOrder),
            ),
          };
        },
      );

      return { previousQueries, toastId: fb.updateLoading(entity.name) };
    },
    onError: (_err, _variables, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.toastId) fb.updateError(entity.name, context.toastId);
    },
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });

      if (context?.toastId) fb.updateSuccess(entity.name, context.toastId);
    },
  });
}
