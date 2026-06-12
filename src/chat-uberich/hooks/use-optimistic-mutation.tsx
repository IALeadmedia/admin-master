import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertMessage } from "../components/common/alert-message";

// Tipagem do hook com genéricos para dados, erro e contexto
export function useOptimisticMutation<TData, TRequest, TResponse>(
  mutationFn: (data: TRequest) => Promise<TResponse>, // Função de mutação
  queryKey: string, // Chave da query que será atualizada
  modifyData: (
    data: TData[],
    request: TRequest,
    response: TResponse,
  ) => TData[], // Função para modificar os dados de forma otimista
  successMessage: string = "Operação realizada com sucesso.", // Mensagem de sucesso
  errorMessage: string = "Ocorreu um erro.", // Mensagem de erro
) {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse,
    Error,
    TRequest,
    { previousData: TData[] | undefined }
  >({
    mutationFn,
    onMutate: async (data: TRequest) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] }); // Cancelando qualquer query anterior
      const previousData = queryClient.getQueryData<TData[]>([queryKey]); // Obtendo os dados antigos da query
      queryClient.setQueryData<TData[]>(
        [queryKey],
        (oldData) => modifyData(oldData || [], data, {} as TResponse), // Modificação otimista dos dados
      );
      return { previousData }; // Retorna os dados anteriores para reversão em caso de erro
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData([queryKey], context?.previousData); // Revertendo mudanças em caso de erro
      AlertMessage(errorMessage, "error");
    },
    onSuccess: () => {
      AlertMessage(successMessage, "success");
    },
  });
}

