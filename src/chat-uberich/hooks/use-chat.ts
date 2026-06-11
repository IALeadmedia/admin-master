import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { MessagesService } from "../service/messages";
import { useChatStore } from "../contexts/chat-context";

const messagesService = new MessagesService();

// Hook otimizado para conectar com o contexto de autenticação e carregar mensagens
export const useChatContext = () => {
  const selectedClientId = import.meta.env.VITE_CLIENT_ID; // mokado de clientId
  // Seletores específicos para evitar rerenders desnecessários com shallow equality
  const chats = useChatStore((state) => state.chats);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const loading = useChatStore((state) => state.loading);
  const errors = useChatStore((state) => state.errors);

  // Actions
  const {
    setSelectedChatId,
    reset,
    initializeChats,
    setChatsLoading,
    setChatError,
    loadMessagesForProspect,
    setMessagesLoading,
    setMessageError,
    addMessage,
    addOptimisticMessage,
    confirmOptimisticMessage,
    rejectOptimisticMessage,
    addNewChat,
    pauseConversation,
    resumeConversation,
    deleteMessage,
    updateMessage,
    changeTemperature,
    getSortedChats,
  } = useChatStore();

  // Query para buscar lista inicial de chats
  const chatsQuery = useQuery({
    queryKey: ["chats", selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];

      setChatsLoading(true);
      setChatError(null);

      try {
        const response = await messagesService.fetchAll(selectedClientId);
        reset(); // Limpa estado anterior
        initializeChats(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao carregar chats";
        setChatError(errorMessage);
        throw error;
      } finally {
        setChatsLoading(false);
      }
    },
    enabled: !!selectedClientId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: (failureCount, error) => {
      // Retry apenas em casos específicos
      if (error instanceof Error && error.message.includes("401")) {
        return false; // Não tenta novamente em caso de não autorizado
      }
      return failureCount < 3;
    },
  });

  // Seleted chat memoizado para evitar recalcular sempre
  const selectedChat = useMemo(() => {
    return selectedChatId ? chats[selectedChatId] || null : null;
  }, [selectedChatId, chats]);

  // Query para buscar mensagens de um chat específico
  const messagesQuery = useQuery({
    queryKey: ["messages", selectedClientId, selectedChatId],
    queryFn: async () => {
      if (!selectedChatId || !selectedChat) return [];

      // Se já foi buscado, não buscar novamente
      if (selectedChat.wasFetch) return selectedChat.messages;

      setMessagesLoading(selectedChatId, true);
      setMessageError(selectedChatId, null);

      try {
        const response = await messagesService.fetchAllMessagesFromProspect(
          selectedChat.id,
        );
        loadMessagesForProspect(selectedChatId, response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao carregar mensagens";
        setMessageError(selectedChatId, errorMessage);
        throw error;
      } finally {
        setMessagesLoading(selectedChatId, false);
      }
    },
    enabled: !!selectedChatId && !!selectedChat && !selectedChat.wasFetch,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false; // Chat não encontrado
      }
      return failureCount < 2;
    },
  });

  // Função otimizada para selecionar chat
  const selectChat = useCallback(
    (chatId: string) => {
      if (selectedChatId !== chatId) {
        setSelectedChatId(chatId);
      }
    },
    [selectedChatId, setSelectedChatId],
  );

  // Função para enviar mensagem com feedback otimista
  const sendMessage = useCallback(
    async (prospectId: string, content: string) => {
      if (!content.trim()) return;

      // Adiciona mensagem otimista para feedback imediato
      const tempId = addOptimisticMessage(prospectId, {
        data: {
          messageType: "text" as any,
          s3: false,
          content: content.trim(),
        },
      });

      try {
        // TODO: Implementar chamada real para enviar mensagem
        // const realMessage = await messagesService.sendMessage(prospectId, content);
        // confirmOptimisticMessage(prospectId, tempId, realMessage);

        // Por enquanto, simula sucesso após delay
        setTimeout(() => {
          confirmOptimisticMessage(prospectId, tempId, {
            id: `real_${Date.now()}`,
            prospectId,
            conversationNumber: 0,
            sender: "user",
            sentAt: new Date().toISOString(),
            platform: "whatsapp",
            data: {
              messageType: "text" as any,
              s3: false,
              content: content.trim(),
            },
            editedAt: null,
            deletedAt: null,
          });
        }, 1000);
      } catch (error) {
        // Remove mensagem otimista em caso de erro
        rejectOptimisticMessage(prospectId, tempId);
        throw error;
      }
    },
    [addOptimisticMessage, confirmOptimisticMessage, rejectOptimisticMessage],
  );

  // Estados derivados memoizados
  const sortedChats = useMemo(() => getSortedChats(), [chats]);

  const isLoadingChats = loading.fetchingChats || chatsQuery.isLoading;
  const isLoadingMessages = selectedChatId
    ? loading.fetchingMessages[selectedChatId] || messagesQuery.isLoading
    : false;

  const chatError = errors.chatError || (chatsQuery.error as Error)?.message;
  const messageError = selectedChatId
    ? errors.messageErrors[selectedChatId] ||
      (messagesQuery.error as Error)?.message
    : null;

  return {
    // Estado
    chats: sortedChats,
    selectedChatId,
    selectedChat,
    selectedClientId,

    // Loading states
    isLoadingChats,
    isLoadingMessages,

    // Error states
    chatError,
    messageError,

    // Actions
    selectChat,
    sendMessage,
    addMessage,
    addNewChat,
    pauseConversation,
    resumeConversation,
    deleteMessage,
    updateMessage,
    changeTemperature,

    // Queries para casos específicos
    chatsQuery,
    messagesQuery,

    // Query status
    isChatsQueryLoading: chatsQuery.isLoading,
    isMessagesQueryLoading: messagesQuery.isLoading,
    chatsQueryError: chatsQuery.error,
    messagesQueryError: messagesQuery.error,
  };
};
