import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { uploadProductFiles } from "@/helpers/uploadProductFiles.helper";
import type {
  IProduct,
  IProductsResponse,
  IUpdateProductPayload,
  ProductModel,
} from "@/types/IProduct.type";

export function useUpdateProductMutation(model: ProductModel = "telecom") {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["products"];

  return useMutation({
    mutationFn: async ({
      id,
      entity: payload,
      conditionFiles,
      detailsImages,
      extrasImages,
    }: IUpdateProductPayload) => {
      await entity.service.update(id, payload, model);

      await uploadProductFiles(
        id,
        { conditionFiles, detailsImages, extrasImages },
        model,
        entity.service,
      );
    },
    onMutate: async ({ id, entity: payload }: IUpdateProductPayload) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousQueries = queryClient.getQueriesData<IProductsResponse>({
        queryKey: [entity.key],
      });

      queryClient.setQueriesData<IProductsResponse>(
        { queryKey: [entity.key] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((product: IProduct) =>
              product.id !== id
                ? product
                : ({ ...product, ...payload } as IProduct),
            ),
          };
        },
      );

      return { previousQueries, toastId: fb.updateLoading(entity.name) };
    },
    onError: (_err, _payload, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.toastId) fb.updateError(entity.name, context.toastId);
    },
    onSuccess: (_data, _payload, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });
      if (context?.toastId) fb.updateSuccess(entity.name, context.toastId);
    },
  });
}
