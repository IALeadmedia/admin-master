import {
  IChat,
  IResponseChatQuery,
  IResponseChatSocket,
  IResponseMessage,
} from "@/interfaces/chat/chat";
import { IMessage } from "@/interfaces/chat/message";

type ChatType = Record<string, IChat>;

export class ChatTransformer {
  // Cache para evitar transformações desnecessárias
  private static transformCache = new Map<string, any>();
  
  // TTL do cache (2 minutos)
  private static cacheTTL = 2 * 60 * 1000;

  // Limpa entradas antigas do cache
  private static cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.transformCache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.transformCache.delete(key);
      }
    }
  }

  // Normaliza data para ISO string
  private static normalizeDate(date: string): string {
    try {
      // Se já termina com Z, retorna como está
      if (date.endsWith('Z')) return date;
      
      // Se não tem timezone info, adiciona Z
      return new Date(date + 'Z').toISOString();
    } catch {
      // Fallback para data atual se inválida
      return new Date().toISOString();
    }
  }

  static transformChats(
    responseChats: IResponseChatQuery[],
    existingChats: ChatType
  ): ChatType {
    // Gera chave para cache baseada nos IDs dos chats
    const cacheKey = `transform-chats-${responseChats.map(c => c.prospect.id).sort().join('-')}`;
    const cached = this.transformCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return { ...existingChats, ...cached.value };
    }

    const chatMap: ChatType = { ...existingChats };
    const newChats: ChatType = {};

    // Agrupa mensagens por prospect primeiro
    const messagesByProspect = new Map<string, IResponseChatQuery[]>();
    
    for (const responseChat of responseChats) {
      const prospectId = responseChat.prospectId;
      
      if (!messagesByProspect.has(prospectId)) {
        messagesByProspect.set(prospectId, []);
      }
      messagesByProspect.get(prospectId)!.push(responseChat);
    }

    // Processa cada prospect
    for (const [prospectId, messages] of messagesByProspect) {
      // Se o chat já existe, pula (evita sobrescrever)
      if (chatMap[prospectId]) {
        continue;
      }

      // Ordena mensagens por data
      const sortedMessages = messages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      // Pega a primeira mensagem para extrair dados do prospect
      const firstMessage = sortedMessages[0];
      const { prospect } = firstMessage;

      // Transforma mensagens
      const transformedMessages: IMessage[] = sortedMessages.map(msg => ({
        id: msg.id,
        prospectId: msg.prospectId,
        conversationNumber: msg.conversationNumber,
        sender: msg.sender,
        sentAt: this.normalizeDate(msg.sentAt),
        platform: msg.platform,
        data: msg.data,
        editedAt: msg.editedAt,
        deletedAt: msg.deletedAt,
      }));

      // Cria o chat
      const chat: IChat = {
        id: prospectId,
        prospect: {
          ...prospect,
          lastInteraction: this.normalizeDate(prospect.lastInteraction),
        },
        messages: transformedMessages,
        wasFetch: false,
        _customKey: prospectId,
      };

      newChats[prospectId] = chat;
      chatMap[prospectId] = chat;
    }

    // Armazena no cache
    this.transformCache.set(cacheKey, {
      value: newChats,
      timestamp: Date.now()
    });

    // Limpa cache se necessário
    if (this.transformCache.size > 50) {
      this.cleanCache();
    }

    return chatMap;
  }

  static prepareChat(responseChat: IResponseChatSocket): IChat {
    const prospectId = responseChat.prospect.id;
    const cacheKey = `prepare-chat-${prospectId}-${responseChat.message.id}`;
    const cached = this.transformCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return cached.value;
    }

    const message: IMessage = {
      ...responseChat.message,
      sentAt: this.normalizeDate(responseChat.message.sentAt),
    };

    const chat: IChat = {
      id: prospectId,
      prospect: {
        ...responseChat.prospect,
        lastInteraction: this.normalizeDate(responseChat.prospect.lastInteraction),
      },
      messages: [message],
      wasFetch: false,
      _customKey: prospectId,
    };

    // Cache do resultado
    this.transformCache.set(cacheKey, {
      value: chat,
      timestamp: Date.now()
    });

    return chat;
  }

  static transformMessagesFromProspect(
    responseMessages: IResponseMessage[]
  ): IMessage[] {
    if (!responseMessages.length) return [];

    const cacheKey = `transform-messages-${responseMessages[0].prospectId}-${responseMessages.length}`;
    const cached = this.transformCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return cached.value;
    }

    // Remove duplicatas por ID
    const uniqueMessages = new Map<string, IResponseMessage>();
    for (const msg of responseMessages) {
      if (!uniqueMessages.has(msg.id)) {
        uniqueMessages.set(msg.id, msg);
      }
    }

    // Transforma e ordena mensagens
    const transformedMessages = Array.from(uniqueMessages.values())
      .map(msg => ({
        ...msg,
        sentAt: this.normalizeDate(msg.sentAt),
      }))
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    // Cache do resultado
    this.transformCache.set(cacheKey, {
      value: transformedMessages,
      timestamp: Date.now()
    });

    return transformedMessages;
  }

  // Método para limpar o cache (útil para desenvolvimento)
  static clearCache(): void {
    this.transformCache.clear();
  }

  // Método para obter informações do cache (útil para debug)
  static getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.transformCache.size,
      keys: Array.from(this.transformCache.keys()),
    };
  }

  // Valida se uma mensagem é válida
  static isValidMessage(message: any): message is IResponseMessage {
    return (
      message &&
      typeof message.id === 'string' &&
      typeof message.prospectId === 'string' &&
      typeof message.sentAt === 'string' &&
      message.data &&
      typeof message.data.content === 'string'
    );
  }

  // Valida se um chat é válido
  static isValidChat(chat: any): chat is IResponseChatSocket {
    return (
      chat &&
      chat.prospect &&
      typeof chat.prospect.id === 'string' &&
      chat.message &&
      this.isValidMessage(chat.message)
    );
  }
}
