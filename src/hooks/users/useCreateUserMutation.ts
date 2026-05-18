import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { ICreateUser } from "@/types/IUser.type";
import { useAuth } from "@/context/auth-provider";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["users"];
  const { user, isGlobalAdmin } = useAuth();

  return useMutation({
    mutationFn: (payload: ICreateUser) => {
      if (isGlobalAdmin) {
        return entity.service.create(payload);
      }

      const companyId = user?.user.company_id ?? null;
      const partnerId = user?.user.partner_id ?? null;

      return entity.service.create({
        ...payload,
        company_id: companyId,
        partner_id: partnerId,
      });
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
