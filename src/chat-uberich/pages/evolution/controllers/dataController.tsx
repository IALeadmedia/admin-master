import { EvolutionService } from "@/chat-uberich/service/evolution";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";

import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useListEntity } from "@/pages/partners/config-page.const";

export function useEvolutionController(
  instanceName?: string,
  showQRCodeModal?: boolean,
) {
  const evolutionService = new EvolutionService();
  const queryClient = useQueryClient();

  const { user, isGlobalAdmin } = useAuth();
  const { selectedCompanyId, selectedPartnerId } = useAdminScope();

  const shouldFetchPartners = isGlobalAdmin
    ? selectedCompanyId != null && selectedPartnerId != null
    : user?.user.company_id != null && user?.user.partner_id != null;

  const { data: partnersData } = useListEntity({
    enabled: shouldFetchPartners,
    companyId: isGlobalAdmin
      ? selectedCompanyId
      : (user?.user.company_id ?? undefined),
    partnerId: isGlobalAdmin
      ? selectedPartnerId
      : (user?.user.partner_id ?? undefined),
    per_page: 100,
  });

  const selectedClientId = useMemo(() => {
    const partners = partnersData?.partners ?? [];

    const selectedPartner = isGlobalAdmin
      ? partners.find(
        (partner) =>
          partner.partner_id === selectedPartnerId &&
          partner.company_id === selectedCompanyId,
      )
      : partners.find(
        (partner) =>
          partner.partner_id === user?.user.partner_id &&
          partner.company_id === user?.user.company_id,
      );

    return selectedPartner?.clientId_uberich;
  }, [
    isGlobalAdmin,
    partnersData,
    selectedCompanyId,
    selectedPartnerId,
    user?.user.company_id,
    user?.user.partner_id,
    user?.user
  ]);

  const { data: evolutionQuery, isFetching } = useQuery({
    queryKey: ["instances", selectedClientId],
    enabled: !!selectedClientId,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return await evolutionService.getAllInstances(selectedClientId!);
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
      evolutionService.createInstance(
        instanceName,
        qrcode,
        number,
        clientId,
      ),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onSuccess: async () => {
      toast.success("Instância criada com sucesso!");

      await queryClient.invalidateQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onError: (error: any) => {
      toast.error("Houve um erro ao criar a instância. Tente novamente");
      console.error(error?.message);
    },
  });

  const { mutate: removeEvolutionInstance } = useMutation({
    mutationFn: async (instanceName: string) =>
      await evolutionService.removeInstance(instanceName),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onSuccess: async () => {
      toast.success("Instância removida com sucesso!");

      await queryClient.invalidateQueries({
        queryKey: ["instances", selectedClientId],
      });

      await queryClient.refetchQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onError: (error: any) => {
      toast.error("Houve um erro ao remover a instância. Tente novamente");
      console.error(error?.message);
    },
  });

  const { mutate: disconnectEvolutionInstance } = useMutation({
    mutationFn: async (instanceName: string) =>
      await evolutionService.disconnectInstance(instanceName),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onSuccess: async () => {
      toast.success("Instância desconectada com sucesso!");

      await queryClient.invalidateQueries({
        queryKey: ["instances", selectedClientId],
      });
    },

    onError: (error: any) => {
      toast.error("Houve um erro ao desconectar a instância. Tente novamente");
      console.error(error?.message);
    },
  });

  const { data: qrCodeQuery, isFetching: isQRCodeFetching } = useQuery({
    queryKey: [
      "qrCodeInstances",
      selectedClientId,
      instanceName,
      showQRCodeModal,
    ],
    enabled: !!instanceName && !!showQRCodeModal,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      return await evolutionService.getQRCodeInstances(instanceName!);
    },

    refetchInterval: (query) => {
      if (
        query.state.data &&
        typeof query.state.data.code === "string" &&
        query.state.data.code.length > 0
      ) {
        return false;
      }

      return 1000;
    },
  });

  return {
    selectedClientId,
    evolution: evolutionQuery,
    isFetching,
    createEvolutionInstance,
    removeEvolutionInstance,
    disconnectEvolutionInstance,
    qrCodeQuery,
    isQRCodeFetching,
  };
}