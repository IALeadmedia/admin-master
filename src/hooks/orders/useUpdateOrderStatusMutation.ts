import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResolvedOrderScope } from "./useResolvedOrderScope";
import type { AnyOrder, AnyOrderResponse } from "@/types/orders";
type UpdateOrderStatusMutationVariables = {
  id: number;
  payload: { status: string };
};

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient.orders;
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateOrderStatusMutationVariables) =>
      entity.service.changeStatus(
        id,
        resolvedModule,
        resolvedOperator,
        payload,
      ),
    onMutate: async ({ id, payload }: UpdateOrderStatusMutationVariables) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<AnyOrderResponse>({
        queryKey: [entity.key],
      });

      queryClient.setQueriesData<AnyOrderResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            orders: old.orders.map((order: AnyOrder) =>
              order.id !== id
                ? order
                : ({ ...order, status: payload.status } as AnyOrder),
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
