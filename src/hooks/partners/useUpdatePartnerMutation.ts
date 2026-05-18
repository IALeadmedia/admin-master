import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type {
  IPartner,
  IPartnerResponse,
  IUpdatePartnerPayload,
} from "@/types/IPartner.type";

export function useUpdatePartnerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["partners"];

  return useMutation({
    mutationFn: async ({
      entity: payload,
      logoFile,
    }: IUpdatePartnerPayload) => {
      await entity.service.update(payload);
      if (logoFile) {
        await entity.service.uploadLogo(payload.partner_id, logoFile);
      }
    },
    onMutate: async ({ entity: newEntity }: IUpdatePartnerPayload) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<IPartnerResponse>([
        entity.key,
      ]);
      //basicamente atualiza a info da query sem precisar chamar o get novamente
      queryClient.setQueryData<IPartnerResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          partners: old.partners.map((entity: IPartner) => {
            if (entity.partner_id === newEntity.partner_id) {
              return { ...entity, ...newEntity };
            }
            return entity;
          }),
        };
      });

      return { previousClients, toastId: fb.updateLoading(entity.name) };
    },
    onError: (_err, _clientId, context) => {
      queryClient.setQueryData([entity.key], context?.previousClients);
      if (context?.toastId) fb.updateError(entity.name, context?.toastId);
    },
    onSuccess: (_err, _clientId, context) => {
      if (context?.toastId) fb.updateSuccess(entity.name, context?.toastId);
    },
  });
}
