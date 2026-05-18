import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { IPartner, IPartnerResponse } from "@/types/IPartner.type";

export function useDeletePartnerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["partners"];

  return useMutation({
    mutationFn: entity.service.deleteItems,
    onMutate: async ({ ids }: { ids: number[] }) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<IPartnerResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<IPartnerResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          partners: old.partners.filter(
            (partner: IPartner) => !ids.includes(partner.partner_id),
          ),
        };
      });

      return {
        previousClients,
        toastId: fb.deleteLoading(entity, ids.length),
      };
    },
    onError: (_err, _clientId, context) => {
      queryClient.setQueryData([entity.key], context?.previousClients);

      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_, variables, context) => {
      if (context?.toastId)
        fb.deleteSuccess(entity, variables.ids.length, context.toastId);
    },
  });
}
