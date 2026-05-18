import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { PartnersPriorityService } from "@/services/partner-priority.service";
import type { IUpdatePartnerPriorityPayload } from "@/types/IPartnerPriority.type";

export function useUpdatePartnerPriorityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdatePartnerPriorityPayload) =>
      PartnersPriorityService.update(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["partner-priorities"] });

      return { toastId: fb.updateLoading("Prioridade de Parceiro") };
    },
    onError: (_err, _vars, context) => {
      if (context?.toastId)
        fb.updateError("Prioridade de Parceiro", context?.toastId);
    },
    onSuccess: (_data, _vars, context) => {
      queryClient.invalidateQueries({ queryKey: ["partner-priorities"] });
      if (context?.toastId)
        fb.updateSuccess("Prioridade de Parceiro", context?.toastId);
    },
  });
}
