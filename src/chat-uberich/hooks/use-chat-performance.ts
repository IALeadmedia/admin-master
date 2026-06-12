import { useMemo } from "react";
import { ChatPerformanceUtils } from "../utils/chat-performance";
import type { IChat } from "../interfaces/chat";
import type { IMessage } from "../interfaces/message";

// Hook para otimizações de performance do chat
export const useChatPerformance = (chat: IChat | null) => {
  // Mensagens ativas (não deletadas) memoizadas
  const activeMessages = useMemo(() => {
    if (!chat) return [];
    return ChatPerformanceUtils.getActiveMessages(chat);
  }, [chat]);

  // Mensagens agrupadas por data memoizadas
  const messagesByDate = useMemo(() => {
    if (!activeMessages.length) return {};
    return ChatPerformanceUtils.groupMessagesByDate(activeMessages);
  }, [activeMessages]);

  // Estatísticas do chat memoizadas
  const chatStats = useMemo(() => {
    if (!chat) return null;
    return ChatPerformanceUtils.getChatStats(chat);
  }, [chat]);

  // Função para buscar mensagens
  const searchMessages = useMemo(() => {
    return (searchTerm: string): IMessage[] => {
      if (!chat) return [];
      return ChatPerformanceUtils.searchMessages(chat, searchTerm);
    };
  }, [chat]);

  // Função para obter contagem de não lidas
  const getUnreadCount = useMemo(() => {
    return (lastReadMessageId?: string): number => {
      if (!chat) return 0;
      return ChatPerformanceUtils.getUnreadCount(chat, lastReadMessageId);
    };
  }, [chat]);

  return {
    activeMessages,
    messagesByDate,
    chatStats,
    searchMessages,
    getUnreadCount,
  };
};

// Hook para comparação de chats (evita re-renders desnecessários)
export const useChatComparison = (chat1: IChat | null, chat2: IChat | null) => {
  return useMemo(() => {
    if (!chat1 || !chat2) return false;
    return ChatPerformanceUtils.areChatsEqual(chat1, chat2);
  }, [chat1, chat2]);
};

// Hook para limpeza periódica do cache
export const useCacheCleanup = (intervalMs: number = 300000) => {
  // 5 minutos
  useMemo(() => {
    const cleanup = () => ChatPerformanceUtils.cleanCache();
    const interval = setInterval(cleanup, intervalMs);

    // Cleanup no unmount
    return () => clearInterval(interval);
  }, [intervalMs]);
};
