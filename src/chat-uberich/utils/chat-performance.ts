import { IChat } from "@/interfaces/chat/chat";
import { IMessage } from "@/interfaces/chat/message";

// Utilitários para otimização de performance do chat
export class ChatPerformanceUtils {
  // Cache para memoização de operações custosas
  private static cache = new Map<string, any>();
  
  // TTL do cache (5 minutos)
  private static cacheTTL = 5 * 60 * 1000;

  // Limpa entradas antigas do cache
  static cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  // Pega valor do cache ou executa função e armazena resultado
  static getCachedOrCompute<T>(key: string, computeFn: () => T): T {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.cacheTTL) {
      return cached.value;
    }

    const result = computeFn();
    this.cache.set(key, { value: result, timestamp: now });
    
    // Limpa cache periodicamente
    if (this.cache.size > 100) {
      this.cleanCache();
    }

    return result;
  }

  // Verifica se duas mensagens são iguais (para evitar re-renders)
  static areMessagesEqual(msg1: IMessage, msg2: IMessage): boolean {
    return (
      msg1.id === msg2.id &&
      msg1.data.content === msg2.data.content &&
      msg1.editedAt === msg2.editedAt &&
      msg1.deletedAt === msg2.deletedAt
    );
  }

  // Verifica se dois chats são iguais (para evitar re-renders)
  static areChatsEqual(chat1: IChat, chat2: IChat): boolean {
    if (chat1.id !== chat2.id) return false;
    if (chat1.messages.length !== chat2.messages.length) return false;
    if (chat1.prospect.lastInteraction !== chat2.prospect.lastInteraction) return false;
    
    // Verifica apenas as últimas 5 mensagens (otimização)
    const recentMessages1 = chat1.messages.slice(-5);
    const recentMessages2 = chat2.messages.slice(-5);
    
    for (let i = 0; i < recentMessages1.length; i++) {
      if (!this.areMessagesEqual(recentMessages1[i], recentMessages2[i])) {
        return false;
      }
    }
    
    return true;
  }

  // Filtra mensagens não deletadas com cache
  static getActiveMessages(chat: IChat): IMessage[] {
    const cacheKey = `active-messages-${chat.id}-${chat.messages.length}`;
    
    return this.getCachedOrCompute(cacheKey, () => 
      chat.messages.filter(msg => !msg.deletedAt)
    );
  }

  // Conta mensagens não lidas com cache
  static getUnreadCount(chat: IChat, lastReadMessageId?: string): number {
    const cacheKey = `unread-count-${chat.id}-${lastReadMessageId || 'none'}-${chat.messages.length}`;
    
    return this.getCachedOrCompute(cacheKey, () => {
      if (!lastReadMessageId) {
        return chat.messages.filter(msg => msg.sender !== 'user' && !msg.deletedAt).length;
      }

      let foundLastRead = false;
      let unreadCount = 0;

      // Conta mensagens após a última lida
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        const msg = chat.messages[i];
        
        if (msg.id === lastReadMessageId) {
          foundLastRead = true;
          break;
        }
        
        if (msg.sender !== 'user' && !msg.deletedAt) {
          unreadCount++;
        }
      }

      return foundLastRead ? unreadCount : 0;
    });
  }

  // Agrupa mensagens por data com cache
  static groupMessagesByDate(messages: IMessage[]): Record<string, IMessage[]> {
    const cacheKey = `grouped-messages-${messages.length}-${messages[messages.length - 1]?.id || 'empty'}`;
    
    return this.getCachedOrCompute(cacheKey, () => {
      const groups: Record<string, IMessage[]> = {};
      
      for (const message of messages) {
        if (message.deletedAt) continue;
        
        const date = new Date(message.sentAt).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      }
      
      return groups;
    });
  }

  // Busca mensagens por texto com cache e debounce
  static searchMessages(chat: IChat, searchTerm: string): IMessage[] {
    if (!searchTerm.trim()) return [];
    
    const cacheKey = `search-${chat.id}-${searchTerm.toLowerCase()}-${chat.messages.length}`;
    
    return this.getCachedOrCompute(cacheKey, () => 
      chat.messages.filter(msg => 
        !msg.deletedAt && 
        msg.data.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Calcula estatísticas do chat com cache
  static getChatStats(chat: IChat): {
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    averageResponseTime: number;
  } {
    const cacheKey = `chat-stats-${chat.id}-${chat.messages.length}`;
    
    return this.getCachedOrCompute(cacheKey, () => {
      const activeMessages = this.getActiveMessages(chat);
      const userMessages = activeMessages.filter(msg => msg.sender === 'user');
      const botMessages = activeMessages.filter(msg => msg.sender !== 'user');
      
      // Calcula tempo médio de resposta (simplificado)
      let totalResponseTime = 0;
      let responseCount = 0;
      
      for (let i = 1; i < activeMessages.length; i++) {
        const prev = activeMessages[i - 1];
        const curr = activeMessages[i];
        
        if (prev.sender === 'user' && curr.sender !== 'user') {
          const responseTime = new Date(curr.sentAt).getTime() - new Date(prev.sentAt).getTime();
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
      
      return {
        totalMessages: activeMessages.length,
        userMessages: userMessages.length,
        botMessages: botMessages.length,
        averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
      };
    });
  }

  // Limpa todo o cache (útil para desenvolvimento ou reset)
  static clearCache(): void {
    this.cache.clear();
  }

  // Obtém informações sobre o cache (útil para debug)
  static getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
