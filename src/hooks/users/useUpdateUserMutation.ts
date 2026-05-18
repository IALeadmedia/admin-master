import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { IUpdateUser, IUser, IUserResponse } from "@/types/IUser.type";
import { useAuth } from "@/context/auth-provider";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["users"];
  const { user, isGlobalAdmin } = useAuth();

  return useMutation({
    mutationFn: (payload: IUpdateUser) => {
      if (isGlobalAdmin) {
        return entity.service.update(payload);
      }

      const companyId = user?.user.company_id ?? null;
      const partnerId = user?.user.partner_id ?? null;

      return entity.service.update({
        ...payload,
        company_id: companyId,
        partner_id: partnerId,
      });
    },
    onMutate: async (newEntity: IUpdateUser) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<IUserResponse>([
        entity.key,
      ]);
      //basicamente atualiza a info da query sem precisar chamar o get novamente
      queryClient.setQueryData<IUserResponse>([entity.key], (old) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((entity: IUser) => {
            if (entity.user_id === newEntity.user_id) {
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
