import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { ICreatePartnerPayload } from "@/types/IPartner.type";

export function useCreatePartnerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["partners"];

  return useMutation({
    mutationFn: async ({
      entity: payload,
      logoFile,
    }: ICreatePartnerPayload) => {
      const createdPartner = await entity.service.create(payload);

      if (logoFile) {
        await entity.service.uploadLogo(createdPartner.partner_id, logoFile);
      }

      return createdPartner;
    },
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
