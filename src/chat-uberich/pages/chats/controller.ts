import { useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesService } from "@/services/messages";
import { useChatContext } from "@/hooks/use-chat";
import { useVirtualList } from "@/hooks/use-virtual-list";

import { useForm } from "react-hook-form";
import { IChat } from "@/interfaces/chat/chat";
import { AlertMessage } from "@/components/chat/common/alert-message";

import { BotsService } from "@/services/bots";
import { ClientsService } from "@/services/chats/clients";
// import { IMessage } from "@/interfaces/chat/message";

const messagesService = new MessagesService();
const botsService = new BotsService();

// Hook para lidar com a lógica de favoritar prospects
// const useFavoriteProspect = () => {
// const { favouritesProspects, changeMyFavourites } = useAuthContext();

// const handleFavoriteSuccess = useCallback(
//   (removed: boolean, prospectId: string) => {
//     if (removed) {
//       changeMyFavourites(
//         favouritesProspects.filter((id) => id !== prospectId),
//       );
//       AlertMessage("Prospect removido dos seus favoritos.", "success");
//     } else {
//       changeMyFavourites([...favouritesProspects, prospectId]);
//       AlertMessage("Prospect adicionado ao dos seus favoritos.", "success");
//     }
//   },
//   [changeMyFavourites, favouritesProspects],
// );

// const favoriteProspectMutation = useMutation({
//   mutationFn: async (prospectId: string) => {
//     const isFavorite = favouritesProspects.includes(prospectId);

//     if (isFavorite) await messagesService.removeFavoriteProspect(prospectId);
//     else await messagesService.addFavoriteProspect(prospectId);

//     return { removed: isFavorite, prospectId };
//   },
//   onSuccess: ({ removed, prospectId }) => {
//     handleFavoriteSuccess(removed, prospectId);
//   },
//   onError: (error) => {
//     AlertMessage("Erro ao tentar editar os favoritos.", "error");
//     console.error({ error });
//   },
// });

//   return { favoriteProspectMutation };
// };

/// Hook para lidar com a lógica do chat
export function useChatController(isByGlobalSearch: boolean = false) {
  const queryClient = useQueryClient();

  const clientsService = new ClientsService();

  // const { favouritesProspects } = useAuthContext();

  const form = useForm({
    defaultValues: {
      botId: "",
      platform: "",
      searchContact: "",
      favorite: false,
      warning: false,
      help: false,
      hot_lead: false,
    },
  });

  const watch = form.watch;

  const {
    chats,
    messagesQuery: previewMessagesQuery,
    selectedChatId,
    selectedChat,
    selectedClientId,
    selectChat,
    isLoadingMessages,
  } = useChatContext();

  // const { favoriteProspectMutation } = useFavoriteProspect();

  const clientsIdQuery = useQuery<any[]>({
    refetchOnWindowFocus: false,
    queryKey: ["clientsFilters", selectedClientId],
    queryFn: async (): Promise<any[]> => {
      const clientId = selectedClientId;
      if (!clientId) return [];
      const response = await clientsService.getClientById(clientId);
      return response ? [response] : [];
    },
  });

  const prospectsFromClientId = useQuery<any[]>({
    refetchOnWindowFocus: false,
    queryKey: ["prospectsFromClient", selectedClientId],
    queryFn: async (): Promise<any[]> => {
      const clientId = selectedClientId;
      if (!clientId) return [];
      const response = await clientsService.getAllProspectsFromClient(
        clientId,
        1,
        500,
      );
      return response ? [response] : [];
    },
  });

  const { searchContact, favorite, help, warning, hot_lead, botId } = watch();

  const searchedGlobalMessagesQuery = useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!selectedClientId,
    queryKey: ["searchedMessages", selectedClientId, searchContact],
    queryFn: async () => {
      const clientId = selectedClientId;
      if (!clientId) return [];
      const response = await messagesService.fetchSearchedWords(
        clientId,
        searchContact,
      );
      return response ? [response] : [];
    },
  });

  const botsQuery = useQuery<any[]>({
    refetchOnWindowFocus: false,
    enabled: !!selectedClientId,
    queryKey: ["bots"],
    queryFn: async (): Promise<any[]> => {
      const response = await botsService.fetchAllBots();
      return response;
    },
    select: (data) => data.filter((bot) => bot?.clientId === selectedClientId),
  });

  // const favoriteChat = useCallback(
  //   async (prospectId: string) => {
  //     await favoriteProspectMutation.mutateAsync(prospectId);
  //   },
  //   [favoriteProspectMutation],
  // );

  const { mutate: handHelpProspect } = useMutation({
    mutationFn: async (prospectId: string) =>
      messagesService.disableHandHelpProspect(prospectId),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["hand-help"] }),
    onSuccess: () => {
      AlertMessage("Pedido de ajuda removido com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["hand-help"] });
    },
    onError: (error) => {
      console.error(error.message);
      AlertMessage("Houve um erro ao remover o pedido de ajuda.", "error");
    },
  });

  const allChatsList = useMemo(
    () =>
      Object.values(chats).filter((chat) =>
        botsQuery.data?.some((bot) => bot?.id === chat?.prospect?.botId),
      ),
    [botsQuery.data, chats],
  );

  const clientMaxTemperature =
    clientsIdQuery.data?.[0]?.countTowardsTemperature?.length ?? 0;

  const filteredChatsList = useMemo(() => {
    let chatList = [...allChatsList];

    const hasSearchText =
      searchContact?.trim().length > 0 && searchContact !== "";
    const hasFilters =
      favorite || help || warning || hasSearchText || hot_lead || botId;

    if (hasFilters) {
      chatList = chatList.filter((chat) => {
        const verify = [];

        // if (favorite) {
        //   verify.push(favouritesProspects.includes(chat.id));
        // }

        if (help) {
          verify.push(chat.prospect.data?.conversa_pendente);
        }

        if (hot_lead) {
          verify.push(
            chat.prospect.data?.temperatura_lead === clientMaxTemperature,
          );
        }

        if (botId) {
          verify.push(chat.prospect.botId === botId);
        }

        if (warning) {
          //TODO: Implement warning filter
          //verify.push(chat.messages.some((message) => message.warning));
        }

        return verify.every((item) => item === true);
      });
    }

    /*
    Função de pegar os nomes filtrados e juntar com o resultado da query 
    de resultados de palavras, criando um contato para cada mensagem de resultado,
    além do proprio resultado do nome
    */
    if (hasSearchText && searchedGlobalMessagesQuery?.data?.length) {
      const flatMessages = searchedGlobalMessagesQuery.data.flat();
      chatList = [];
      const chatListExtra: IChat[] = [];

      const nameMatches = allChatsList
        .filter((chat) => {
          const name = (
            chat.prospect.data?.nome ||
            chat.prospect.platformData?.name ||
            chat.prospect.externalId
          )
            ?.trim()
            .toLowerCase();
          return name?.includes(searchContact.toLowerCase());
        })
        .map((chat) => ({
          ...chat,
          isResultByMessage: false,
          _customKey: `name-${chat.id}`,
        }));

      flatMessages.forEach((message: any, index: number) => {
        const prospectId = message.prospectId;

        const originalChat = allChatsList.find(
          (chat) => chat.id === prospectId,
        );

        if (originalChat) {
          const clonedChat = {
            ...originalChat,
            messages: [message],
            _customKey: `${message.id}-${
              message.messages?.[0]?.id || message.messages?.[0]?.sentAt
            }-${index}`,
            isResultByMessage: true,
          };
          chatListExtra.push(clonedChat);
        }
      });

      chatList = [...nameMatches, ...chatListExtra];
    }

    return chatList.sort((a, b) => {
      // Usa lastInteraction do prospect como prioridade, fallback para última mensagem
      const aDate = a?.prospect?.lastInteraction
        ? new Date(a.prospect.lastInteraction).getTime()
        : a?.messages?.at(-1)?.sentAt
          ? new Date(a.messages.at(-1)!.sentAt).getTime()
          : 0;

      const bDate = b?.prospect?.lastInteraction
        ? new Date(b.prospect.lastInteraction).getTime()
        : b?.messages?.at(-1)?.sentAt
          ? new Date(b.messages.at(-1)!.sentAt).getTime()
          : 0;

      return bDate - aDate;
    });
  }, [
    allChatsList,
    searchContact,
    favorite,
    help,
    warning,
    hot_lead,
    searchedGlobalMessagesQuery,
    botId,
  ]);

  // Aplicar ordenação adicional para separar por tipo quando há busca global
  const sortedFilteredChatsList = useMemo(() => {
    if (!isByGlobalSearch) return filteredChatsList;

    return [...filteredChatsList].sort((a, b) => {
      // Primeiro ordena por tipo (nome vs mensagem)
      const aIsName = a.isResultByMessage ? 1 : 0;
      const bIsName = b.isResultByMessage ? 1 : 0;
      const typeComparison = aIsName - bIsName;

      // Se são do mesmo tipo, ordena por data
      if (typeComparison === 0) {
        const aDate = a?.prospect?.lastInteraction
          ? new Date(a.prospect.lastInteraction).getTime()
          : a?.messages?.at(-1)?.sentAt
            ? new Date(a.messages.at(-1)!.sentAt).getTime()
            : 0;

        const bDate = b?.prospect?.lastInteraction
          ? new Date(b.prospect.lastInteraction).getTime()
          : b?.messages?.at(-1)?.sentAt
            ? new Date(b.messages.at(-1)!.sentAt).getTime()
            : 0;

        return bDate - aDate;
      }

      return typeComparison;
    });
  }, [filteredChatsList, isByGlobalSearch]);

  // Virtualização da lista de chats para melhor performance
  const virtualChatsList = useVirtualList(sortedFilteredChatsList, {
    itemsPerPage: 30, // Mostra 30 chats por vez
    initialPage: 1,
  });

  // Reset da paginação quando os filtros mudam ou quando a lista é reordenada
  useEffect(() => {
    virtualChatsList.resetToFirst();
  }, [searchContact, favorite, help, warning, hot_lead, botId]);

  // Reset da paginação quando há mudanças significativas nos chats
  useEffect(() => {
    // Apenas reseta se não estamos na primeira página para evitar flickering
    if (virtualChatsList.currentPage > 1) {
      virtualChatsList.resetToFirst();
    }
  }, [Object.keys(chats).length, sortedFilteredChatsList.length]);

  return {
    clientsIdQuery,

    query: previewMessagesQuery,
    chats,
    allChatsList,
    filteredChatsList,
    selectedChatId,
    selectedChat,
    isLoadingMessages,
    botsQuery,
    form,
    filters: { searchContact, favorite, help, warning, hot_lead },
    selectChat,
    handHelpProspect,
    prospectsFromClientId,
    // Virtualização
    virtualChatsList,
  };
}
