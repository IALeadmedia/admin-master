// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
// import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
// import type { ICompany } from "@/types/ICompany.type";

// export function useDeleteCompanyMutation() {
//   const queryClient = useQueryClient();
//   const entity = dictionaryQueryClient["companies"];

//   return useMutation({
//     mutationFn: entity.service.deleteItems,
//     onMutate: async ({ ids }: { ids: string[] }) => {
//       console.log("onMutate delete", ids);
//       await queryClient.cancelQueries({ queryKey: [entity.key] });

//       const previousClients = queryClient.getQueryData<ICompany[]>([
//         entity.key,
//       ]);

//       queryClient.setQueryData<ICompany[]>([entity.key], (old) =>
//         old?.filter((client) => !ids.includes(client.company_id)),
//       );

//       return {
//         previousClients,
//         toastId: fb.deleteLoading(entity, ids.length),
//       };
//     },
//     onError: (_err, _clientId, context) => {
//       queryClient.setQueryData([entity.key], context?.previousClients);

//       if (context?.toastId) fb.deleteError(entity, context.toastId);
//     },
//     onSuccess: (_, variables, context) => {
//       if (context?.toastId)
//         fb.deleteSuccess(entity, variables.ids.length, context.toastId);
//     },
//   });
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { ICompany, ICompanyResponse } from "@/types/ICompany.type";

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["companies"];

  return useMutation({
    mutationFn: entity.service.deleteItems,
    onMutate: async ({ ids }: { ids: number[] }) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<ICompanyResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<ICompanyResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          companies: old.companies.filter(
            (company: ICompany) => !ids.includes(company.company_id),
          ),
        };
      });

      return {
        previousClients,
        toastId: fb.deleteLoading(entity, ids.length),
      };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData([entity.key], context?.previousClients);

      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [entity.key],
      });

      if (context?.toastId) {
        fb.deleteSuccess(entity, variables.ids.length, context.toastId);
      }
    },
  });
}
