import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type {
  IDeleteProductPayload,
  IProduct,
  IProductsResponse,
  ProductModel,
} from "@/types/IProduct.type";

export function useDeleteProductMutation(model: ProductModel = "telecom") {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["products"];

  return useMutation({
    mutationFn: ({ ids, model: payloadModel }: IDeleteProductPayload) =>
      entity.service.deleteItems({ ids, model: payloadModel ?? model }),
    onMutate: async ({ ids }: IDeleteProductPayload) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<IProductsResponse>({
        queryKey: [entity.key],
      });

      queryClient.setQueriesData<IProductsResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;

          const nextProducts = old.products.filter(
            (product: IProduct) => !ids.includes(product.id),
          );

          return {
            ...old,
            products: nextProducts,
            total: nextProducts.length,
          };
        },
      );

      return {
        previousQueries,
        toastId: fb.deleteLoading(entity, ids.length),
      };
    },
    onError: (_err, _variables, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [entity.key],
      });

      if (context?.toastId) {
        fb.deleteSuccess(entity, variables.ids.length, context.toastId);
      }
    },
  });
}
