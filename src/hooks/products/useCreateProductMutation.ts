import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { uploadProductFiles } from "@/helpers/uploadProductFiles.helper";
import type {
  ICreateProductPayload,
  ProductModel,
} from "@/types/IProduct.type";

export function useCreateProductMutation(model: ProductModel = "telecom") {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["products"];

  return useMutation({
    mutationFn: async ({
      entity: payload,
      conditionFiles,
      detailsImages,
      extrasImages,
    }: ICreateProductPayload) => {
      const createdProduct = await entity.service.create(payload, model);

      await uploadProductFiles(
        createdProduct.id,
        { conditionFiles, detailsImages, extrasImages },
        model,
        entity.service,
      );

      return createdProduct;
    },
    onMutate: () => ({
      toastId: fb.createLoading(entity.name),
    }),
    onError: (_err, _payload, context) => {
      if (context?.toastId) fb.createError(entity.name, context.toastId);
    },
    onSuccess: (_data, _payload, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });
      if (context?.toastId) fb.createSuccess(entity.name, context.toastId);
    },
  });
}
