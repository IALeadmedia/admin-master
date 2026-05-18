import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { PartnersPriorityService } from "@/services/partner-priority.service";
import type { IPartnerPriority } from "@/types/IPartnerPriority.type";

const entity = {
  name: "Prioridade de Parceiro",
  plural: "Prioridades de Parceiro",
};

export function useDeletePartnerPriorityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { ids: number[] }) =>
      PartnersPriorityService.deleteItems(payload),
    onMutate: async ({ ids }: { ids: number[] }) => {
      await queryClient.cancelQueries({ queryKey: ["partner-priorities"] });

      const previousData = queryClient.getQueryData<IPartnerPriority[]>([
        "partner-priorities",
      ]);

      queryClient.setQueryData<IPartnerPriority[]>(
        ["partner-priorities"],
        (old) => {
          if (!old) return old;
          return old.filter((item) => !ids.includes(item.id));
        },
      );

      return {
        previousData,
        toastId: fb.deleteLoading(entity, ids.length),
      };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["partner-priorities"], context?.previousData);
      if (context?.toastId) fb.deleteError(entity, context?.toastId);
    },
    onSuccess: (_data, { ids }, context) => {
      queryClient.invalidateQueries({ queryKey: ["partner-priorities"] });
      if (context?.toastId)
        fb.deleteSuccess(entity, ids.length, context?.toastId);
    },
  });
}
