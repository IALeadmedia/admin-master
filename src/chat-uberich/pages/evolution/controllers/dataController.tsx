import { EvolutionService } from "@/services/chats/evolution";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useEvolutionController(
  instanceName?: string,
  showQRCodeModal?: boolean,
) {
  const evolutionService = new EvolutionService();
  const queryClient = useQueryClient();

  const selectedClientId = import.meta.env.VITE_CLIENT_ID;
  const { data: evolutionQuery, isFetching } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["instances"],
    queryFn: async (): Promise<any> => {
      const response = await evolutionService.getAllInstances(selectedClientId);
      return response;
    },
  });

  const { mutate: createEvolutionInstance } = useMutation({
    mutationFn: async ({
      instanceName,
      qrcode,
      number,
      clientId,
    }: {
      instanceName: string;
      qrcode: boolean;
      number: string;
      clientId: string;
    }) =>
      evolutionService.createInstance(instanceName, qrcode, number, clientId),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["instances"] }),
    onSuccess: () => {
      toast.success("Instância criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["instances"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao criar a instância. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removeEvolutionInstance } = useMutation({
    mutationFn: async (instanceName: string) =>
      await evolutionService.removeInstance(instanceName),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["instances"] }),
    onSuccess: async () => {
      toast.success("Instância removida com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["instances"] });
      await queryClient.refetchQueries({ queryKey: ["instances"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao remover a instância. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: disconnectEvolutionInstance } = useMutation({
    mutationFn: async (instanceName: string) =>
      await evolutionService.disconnectInstance(instanceName),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["instances"] }),
    onSuccess: () => {
      toast.success("Instância desconectada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["instances"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao desconectar a instância. Tente novamente");
      console.error(error.message);
    },
  });

  const { data: qrCodeQuery, isFetching: isQRCodeFetching } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["qrCodeInstances", instanceName, showQRCodeModal],
    queryFn: async (): Promise<any> => {
      const response = await evolutionService.getQRCodeInstances(instanceName!);
      return response;
    },
    enabled: !!instanceName && !!showQRCodeModal,
    refetchInterval: (query) => {
      if (
        query.state.data &&
        typeof query.state.data.code === "string" &&
        query.state.data.code.length > 0
      )
        return false;
      return 1000;
    },
  });

  return {
    evolution: evolutionQuery,
    isFetching,
    createEvolutionInstance,
    removeEvolutionInstance,
    qrCodeQuery,
    disconnectEvolutionInstance,
    isQRCodeFetching,
  };
}
