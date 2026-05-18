// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
// import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
// import type { IUpdateCompany, ICompany } from "@/types/ICompany.type";

// export function useUpdateCompanyMutation() {
//   const queryClient = useQueryClient();
//   const entity = dictionaryQueryClient["companies"];

//   return useMutation({
//     mutationFn: entity.service.update,
//     onMutate: async (newEntity: IUpdateCompany) => {
//       console.log("onMutate update", newEntity);
//       await queryClient.cancelQueries({ queryKey: [entity.key] });

//       const previousClients = queryClient.getQueryData<ICompany[]>([
//         entity.key,
//       ]);
//       //basicamente atualiza a info da query sem precisar chamar o get novamente
//       queryClient.setQueryData<ICompany[]>([entity.key], (old) =>
//         old?.map((entity) => {
//           if (entity.company_id == newEntity.company_id)
//             return { ...entity, ...newEntity };
//           return entity;
//         }),
//       );

//       return { previousClients, toastId: fb.updateLoading(entity.name) };
//     },
//     onError: (_err, _clientId, context) => {
//       queryClient.setQueryData([entity.key], context?.previousClients);
//       if (context?.toastId) fb.updateError(entity.name, context?.toastId);
//     },
//     onSuccess: (_err, _clientId, context) => {
//       if (context?.toastId) fb.updateSuccess(entity.name, context?.toastId);
//     },
//   });
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type {
  IUpdateCompany,
  ICompany,
  ICompanyResponse,
} from "@/types/ICompany.type";

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["companies"];

  return useMutation({
    mutationFn: entity.service.update,
    onMutate: async (newEntity: IUpdateCompany) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousClients = queryClient.getQueryData<ICompanyResponse>([
        entity.key,
      ]);
      //basicamente atualiza a info da query sem precisar chamar o get novamente
      queryClient.setQueryData<ICompanyResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          companies: old.companies.map((entity: ICompany) => {
            if (entity.company_id === newEntity.company_id) {
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
      if (context?.toastId) fb.updateError(entity.name, context.toastId);
    },
    onSuccess: (_err, _clientId, context) => {
      if (context?.toastId) fb.updateSuccess(entity.name, context.toastId);
    },
  });
}
