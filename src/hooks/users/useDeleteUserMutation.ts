import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { IUser, IUserResponse } from "@/types/IUser.type";

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["users"];

  return useMutation({
    mutationFn: entity.service.deleteItems,
    onMutate: async ({ ids }: { ids: number[] }) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<IUserResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<IUserResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.filter((user: IUser) => !ids.includes(user.user_id)),
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
