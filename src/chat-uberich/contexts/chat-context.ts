import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  IChat,
  IResponseChatQuery,
  IResponseChatSocket,
  IResponseMessage,
} from "../interfaces/chat";
import type { IMessage } from "../interfaces/message";
import { ChatTransformer } from "../utils/chat-transformer";

type ProspectId = string;

// Estado de loading para cada operação
interface LoadingState {
  fetchingChats: boolean;
  fetchingMessages: Record<ProspectId, boolean>;
  sendingMessage: Record<string, boolean>; // messageId -> loading
}

// Estado de erro
interface ErrorState {
  chatError: string | null;
  messageErrors: Record<ProspectId, string | null>;
}

// Definição do estado do chat
interface ChatState {
  // Estado principal
  chats: Record<ProspectId, IChat>;
  selectedChatId: string | null;

  // Estados de controle
  loading: LoadingState;
  errors: ErrorState;

  // Cache de mensagens para evitar re-fetches desnecessários
  messageCache: Record<ProspectId, { timestamp: number; messages: IMessage[] }>;

  // Actions básicas
  setSelectedChatId: (id: string | null) => void;
  reset: () => void;

  // Actions de inicialização
  initializeChats: (responseChats: IResponseChatQuery[]) => void;
  setChatsLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;

  // Actions de mensagens
  addMessage: (message: IResponseChatSocket) => void;
  addOptimisticMessage: (
    prospectId: string,
    message: Partial<IMessage>,
  ) => string;
  confirmOptimisticMessage: (
    prospectId: string,
    tempId: string,
    realMessage: IMessage,
  ) => void;
  rejectOptimisticMessage: (prospectId: string, tempId: string) => void;
  loadMessagesForProspect: (
    prospectId: string,
    messages: IResponseMessage[],
  ) => void;
  setMessagesLoading: (prospectId: string, loading: boolean) => void;
  setMessageError: (prospectId: string, error: string | null) => void;

  // Actions de chat
  addNewChat: (responseChat: IResponseChatSocket) => void;
  pauseConversation: (prospectId: string) => void;
  resumeConversation: (prospectId: string) => void;
  changeTemperature: (prospectId: string, temperature: number) => void;

  // Actions de mensagens individuais
  deleteMessage: (prospectId: string, messageId: string) => void;
  updateMessage: (prospectId: string, messageId: string, text: string) => void;

  // Selectors otimizados
  getChatById: (prospectId: string) => IChat | null;
  getSelectedChat: () => IChat | null;
  getSortedChats: () => IChat[];
  getUnreadCount: (prospectId: string) => number;
}

// Criação do store com Zustand - versão otimizada
export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    chats: {},
    selectedChatId: null,
    loading: {
      fetchingChats: false,
      fetchingMessages: {},
      sendingMessage: {},
    },
    errors: {
      chatError: null,
      messageErrors: {},
    },
    messageCache: {},

    // Actions básicas
    setSelectedChatId: (id) => {
      const currentState = get();
      if (currentState.selectedChatId !== id) {
        set({ selectedChatId: id });
      }
    },

    reset: () =>
      set({
        chats: {},
        selectedChatId: null,
        loading: {
          fetchingChats: false,
          fetchingMessages: {},
          sendingMessage: {},
        },
        errors: {
          chatError: null,
          messageErrors: {},
        },
        messageCache: {},
      }),

    // Actions de loading e erro - otimizadas para evitar rerenders
    setChatsLoading: (loading) => {
      const currentState = get();
      if (currentState.loading.fetchingChats !== loading) {
        set((state) => ({
          loading: { ...state.loading, fetchingChats: loading },
        }));
      }
    },

    setChatError: (error) => {
      const currentState = get();
      if (currentState.errors.chatError !== error) {
        set((state) => ({
          errors: { ...state.errors, chatError: error },
        }));
      }
    },

    setMessagesLoading: (prospectId, loading) => {
      const currentState = get();
      if (currentState.loading.fetchingMessages[prospectId] !== loading) {
        set((state) => ({
          loading: {
            ...state.loading,
            fetchingMessages: {
              ...state.loading.fetchingMessages,
              [prospectId]: loading,
            },
          },
        }));
      }
    },

    setMessageError: (prospectId, error) => {
      const currentState = get();
      if (currentState.errors.messageErrors[prospectId] !== error) {
        set((state) => ({
          errors: {
            ...state.errors,
            messageErrors: {
              ...state.errors.messageErrors,
              [prospectId]: error,
            },
          },
        }));
      }
    },

    // Inicialização de chats - otimizada
    initializeChats: (responseChats) => {
      const transformedChats = ChatTransformer.transformChats(
        responseChats,
        {},
      );
      set((state) => ({
        chats: { ...state.chats, ...transformedChats },
        loading: { ...state.loading, fetchingChats: false },
        errors: { ...state.errors, chatError: null },
      }));
    },

    // Adicionar mensagem com verificação de duplicatas - otimizada
    addMessage: (responseMessage) => {
      const { prospect, message } = responseMessage;
      const prospectId = prospect.id;

      const currentState = get();
      const currentChat = currentState.chats[prospectId];

      // Se o chat não existe, tenta criar ou ignora
      if (!currentChat) {
        console.warn(`Chat ${prospectId} não encontrado. Criando novo chat.`);
        const newChat = ChatTransformer.prepareChat(responseMessage);
        set((state) => ({
          chats: {
            ...state.chats,
            [prospectId]: newChat,
          },
        }));
        return;
      }

      // Verifica duplicatas
      const messageExists = currentChat.messages.some(
        (m) => m.id === message.id,
      );
      if (messageExists) {
        return; // Não atualiza se já existe
      }

      // Adiciona a mensagem de forma otimizada
      set((state) => {
        const chat = state.chats[prospectId];
        if (!chat) return state;

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...chat,
              messages: [...chat.messages, message],
              prospect: {
                ...chat.prospect,
                lastInteraction: new Date(message?.sentAt + "Z").toISOString(),
              },
            },
          },
        };
      });
    },

    // Mensagem otimista para UX melhor
    addOptimisticMessage: (prospectId, messageData) => {
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const optimisticMessage: IMessage = {
        id: tempId,
        prospectId,
        conversationNumber: 0,
        sender: "user",
        sentAt: new Date().toISOString(),
        platform: "whatsapp",
        data: {
          messageType: "conversation",
          s3: false,
          content: messageData.data?.content || "",
        },
        editedAt: null,
        deletedAt: null,
        ...messageData,
      };

      const currentState = get();
      const currentChat = currentState.chats[prospectId];

      if (!currentChat) {
        console.warn(
          `Chat ${prospectId} não encontrado para mensagem otimista`,
        );
        return tempId;
      }

      set((state) => ({
        chats: {
          ...state.chats,
          [prospectId]: {
            ...currentChat,
            messages: [...currentChat.messages, optimisticMessage],
          },
        },
      }));

      return tempId;
    },

    // Confirmar mensagem otimista
    confirmOptimisticMessage: (prospectId, tempId, realMessage) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        const updatedMessages = currentChat.messages.map((msg) =>
          msg.id === tempId ? realMessage : msg,
        );

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              messages: updatedMessages,
            },
          },
        };
      });
    },

    // Rejeitar mensagem otimista
    rejectOptimisticMessage: (prospectId, tempId) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        const updatedMessages = currentChat.messages.filter(
          (msg) => msg.id !== tempId,
        );

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              messages: updatedMessages,
            },
          },
        };
      });
    },

    // Carregar mensagens para um prospect específico
    loadMessagesForProspect: (prospectId, messages) => {
      const transformedMessages =
        ChatTransformer.transformMessagesFromProspect(messages);

      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        // Atualiza o cache
        const newCache = {
          ...state.messageCache,
          [prospectId]: {
            timestamp: Date.now(),
            messages: transformedMessages,
          },
        };

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              messages: transformedMessages,
              wasFetch: true,
            },
          },
          messageCache: newCache,
          loading: {
            ...state.loading,
            fetchingMessages: {
              ...state.loading.fetchingMessages,
              [prospectId]: false,
            },
          },
        };
      });
    },

    // Adicionar novo chat
    addNewChat: (responseChat) => {
      const transformedChat = ChatTransformer.prepareChat(responseChat);

      set((state) => ({
        chats: {
          ...state.chats,
          [responseChat.prospect.id]: transformedChat,
        },
      }));
    },

    // Pausar conversa
    pauseConversation: (prospectId) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              prospect: {
                ...currentChat.prospect,
                data: {
                  ...currentChat.prospect.data,
                  conversa_pausada: true,
                },
              },
            },
          },
        };
      });
    },

    // Retomar conversa
    resumeConversation: (prospectId) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              prospect: {
                ...currentChat.prospect,
                data: {
                  ...currentChat.prospect.data,
                  conversa_pausada: false,
                },
              },
            },
          },
        };
      });
    },

    // Alterar temperatura
    changeTemperature: (prospectId, temperature) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              prospect: {
                ...currentChat.prospect,
                data: {
                  ...currentChat.prospect.data,
                  temperatura_lead: temperature,
                },
              },
            },
          },
        };
      });
    },

    // Deletar mensagem
    deleteMessage: (prospectId, messageId) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        const updatedMessages = currentChat.messages.map((message) =>
          message.id === messageId
            ? { ...message, deletedAt: new Date().toISOString() }
            : message,
        );

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              messages: updatedMessages,
            },
          },
        };
      });
    },

    // Atualizar mensagem
    updateMessage: (prospectId, messageId, text) => {
      set((state) => {
        const currentChat = state.chats[prospectId];
        if (!currentChat) return state;

        const updatedMessages = currentChat.messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                data: { ...message.data, content: text },
                editedAt: new Date().toISOString(),
              }
            : message,
        );

        return {
          chats: {
            ...state.chats,
            [prospectId]: {
              ...currentChat,
              messages: updatedMessages,
            },
          },
        };
      });
    },

    // Selectors otimizados - memoizados internamente
    getChatById: (prospectId) => {
      const state = get();
      return state.chats[prospectId] || null;
    },

    getSelectedChat: () => {
      const state = get();
      return state.selectedChatId
        ? state.chats[state.selectedChatId] || null
        : null;
    },

    getSortedChats: () => {
      const state = get();
      const chatsArray = Object.values(state.chats);

      // Cache do sort para evitar recomputações desnecessárias
      return chatsArray.sort(
        (a, b) =>
          new Date(b.prospect.lastInteraction).getTime() -
          new Date(a.prospect.lastInteraction).getTime(),
      );
    },

    getUnreadCount: (prospectId) => {
      const state = get();
      const chat = state.chats[prospectId];
      if (!chat) return 0;

      // Implementar lógica de não lidas baseada em algum critério
      return chat.messages.filter(
        (msg) => msg.sender !== "user" && !msg.deletedAt,
      ).length;
    },
  })),
);
