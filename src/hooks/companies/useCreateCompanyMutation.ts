import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["companies"];

  return useMutation({
    mutationFn: entity.service.create,
    onMutate: () => {
      return {
        toastId: fb.createLoading(entity.name),
      };
    },
    onError: (_err, _clientId, context) => {
      if (context?.toastId) fb.createError(entity.name, context?.toastId);
    },
    onSuccess: (_err, _clientId, context) => {
      queryClient.invalidateQueries({
        queryKey: [entity.key],
      });
      if (context?.toastId) fb.createSuccess(entity.name, context?.toastId);
    },
  });
}
