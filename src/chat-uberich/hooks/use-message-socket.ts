import { useCallback, useEffect, useRef } from "react";
import { messagesSocket as socket } from "../configs/socket";
import { useChatContext } from "./use-chat";
import { Howl } from "howler";
import { CHAT_CONFIG, socketLogger } from "../configs/chat-config";
import type { IResponseChatSocket } from "../interfaces/chat";
// import { AuthService } from "@/services/auth.service";

// const authService = new AuthService();

// Interface para controlar o estado do socket
interface SocketState {
  isConnected: boolean;
  reconnectAttempts: number;
  lastError: string | null;
}

export const useMessageSocket = () => {
  const { addMessage, addNewChat, pauseConversation, resumeConversation } =
    useChatContext();
  const selectedClientId = import.meta.env.VITE_CLIENT_ID; // mokado de clientId

  const soundRef = useRef<Howl | null>(null);

  async function requestNotificationPermission() {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações.");
      return;
    }
    const permission = await Notification.requestPermission();
    console.log("Permissão de notificação:", permission);
  }
  // Envia notificação somente se a aba não estiver visível
  function notifyIfNotFocused(title: string, options?: NotificationOptions) {
    if (
      document.visibilityState !== "visible" &&
      Notification.permission === "granted"
    ) {
      new Notification(title, options);
    }
  }
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/mixkit-software-interface-remove-2576.wav"],
      volume: 1.0,
      preload: true,
    });
    return () => {
      soundRef.current?.unload();
      soundRef.current = null;
    };
  }, []);

  const handleNotify = useCallback(
    (title?: string, body?: string, icon?: string) => {
      setTimeout(() => {
        notifyIfNotFocused(title ?? "Você tem uma nova notiticação", {
          body: body ?? "",
          icon: icon ?? "/icon.png",
          silent: true,
        });
      }, 2000);
    },
    [],
  );

  // Ref para controlar o estado do socket
  const socketState = useRef<SocketState>({
    isConnected: false,
    reconnectAttempts: 0,
    lastError: null,
  });

  // Controle de reconexão usando configurações centralizadas
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  // Função para limpar timers
  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  }, []);

  // Handlers otimizados com useCallback para evitar rerenders
  const onMessageUpsert = useCallback(
    (socketMessage: IResponseChatSocket) => {
      try {
        // Validação robusta da mensagem
        if (!socketMessage?.message?.id || !socketMessage?.prospect?.id) {
          socketLogger.warn("Mensagem inválida recebida:", socketMessage);
          return;
        }

        console.log(socketMessage);
        addMessage(socketMessage);

        if (socketMessage.message.sender !== "Prospect") return;
        if (socketMessage.clientId !== selectedClientId) return;

        socketLogger.log("Mensagem processada:", socketMessage.message.id);
      } catch (error) {
        socketLogger.error("Erro ao processar mensagem recebida:", error);
      }
    },
    [addMessage, handleNotify, selectedClientId],
  );

  const onSendMessage = useCallback(
    (socketMessage: IResponseChatSocket) => {
      try {
        if (!socketMessage?.message?.id || !socketMessage?.prospect?.id) {
          socketLogger.warn("Mensagem enviada inválida:", socketMessage);
          return;
        }

        addMessage(socketMessage);
        socketLogger.log(
          "Mensagem enviada confirmada:",
          socketMessage.message.id,
        );
      } catch (error) {
        socketLogger.error("Erro ao processar mensagem enviada:", error);
      }
    },
    [addMessage],
  );

  const onNewProspect = useCallback(
    (socketMessage: IResponseChatSocket) => {
      try {
        if (!socketMessage?.prospect?.id) {
          socketLogger.warn("Novo prospect inválido:", socketMessage);
          return;
        }

        addNewChat(socketMessage);

        socketLogger.log(
          "Novo prospect adicionado:",
          socketMessage.prospect.id,
        );
      } catch (error) {
        socketLogger.error("Erro ao processar novo prospect:", error);
      }
    },
    [addNewChat],
  );

  const onPauseConversation = useCallback(
    (socketMessage: { prospectId: string }) => {
      try {
        if (!socketMessage?.prospectId) {
          socketLogger.warn(
            "Prospect ID inválido para pausar conversa:",
            socketMessage,
          );
          return;
        }

        pauseConversation(socketMessage.prospectId);
        socketLogger.log("Conversa pausada:", socketMessage.prospectId);
      } catch (error) {
        socketLogger.error("Erro ao pausar conversa:", error);
      }
    },
    [pauseConversation],
  );

  const onResumeConversation = useCallback(
    (socketMessage: { prospectId: string }) => {
      try {
        if (!socketMessage?.prospectId) {
          socketLogger.warn(
            "Prospect ID inválido para retomar conversa:",
            socketMessage,
          );
          return;
        }

        resumeConversation(socketMessage.prospectId);
        socketLogger.log("Conversa retomada:", socketMessage.prospectId);
      } catch (error) {
        socketLogger.error("Erro ao retomar conversa:", error);
      }
    },
    [resumeConversation],
  );

  // Função para conectar ao socket
  const connectSocket = useCallback(() => {
    try {
      socketState.current.lastError = null;

      // const authToken = authService.getAuthToken();
      // if (authToken) {
      //   socket.auth = { token: authToken.token };
      // }
      socket.connect();
    } catch (error) {
      socketLogger.error("Erro ao conectar socket:", error);
      socketState.current.lastError =
        error instanceof Error ? error.message : "Erro desconhecido";
    }
  }, []);

  // Função para reconectar com backoff exponencial
  const scheduleReconnect = useCallback(() => {
    if (
      socketState.current.reconnectAttempts >=
      CHAT_CONFIG.MAX_RECONNECT_ATTEMPTS
    ) {
      socketLogger.error(
        "Máximo de tentativas de reconexão atingido",
        new Error("Max reconnect attempts reached"),
      );
      return;
    }

    const delay =
      CHAT_CONFIG.RECONNECT_DELAY *
      Math.pow(2, socketState.current.reconnectAttempts);

    clearReconnectTimer();
    reconnectTimer.current = setTimeout(() => {
      socketState.current.reconnectAttempts++;
      socketLogger.log(
        `Tentativa de reconexão ${socketState.current.reconnectAttempts}/${CHAT_CONFIG.MAX_RECONNECT_ATTEMPTS}`,
      );
      connectSocket();
    }, delay);
  }, [connectSocket, clearReconnectTimer]);

  // Effect principal para gerenciar conexão do socket
  useEffect(() => {
    // Event handlers
    const handleConnect = () => {
      socketState.current.isConnected = true;
      socketState.current.reconnectAttempts = 0;
      socketState.current.lastError = null;
      clearReconnectTimer();
      socketLogger.log("Socket conectado com sucesso");
    };

    const handleDisconnect = (reason: string) => {
      socketState.current.isConnected = false;
      socketLogger.warn("Socket desconectado:", reason);

      // Tenta reconectar apenas em casos específicos
      if (reason === "io server disconnect" || reason === "transport close") {
        scheduleReconnect();
      }
    };

    const handleError = (error: Error) => {
      socketState.current.lastError = error.message;
      socketLogger.error("Erro no socket:", error);
    };

    // Registra os event handlers
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Handlers de mensagens - usando os eventos corretos
    socket.on("messages.upsert", onMessageUpsert);
    socket.on("send.message", onSendMessage);
    socket.on("new.prospect", onNewProspect);
    socket.on("pause-conversation", onPauseConversation);
    socket.on("resume-conversation", onResumeConversation);

    // Conecta inicialmente
    connectSocket();

    // Cleanup
    return () => {
      clearReconnectTimer();
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("messages.upsert", onMessageUpsert);
      socket.off("send.message", onSendMessage);
      socket.off("new.prospect", onNewProspect);
      socket.off("pause-conversation", onPauseConversation);
      socket.off("resume-conversation", onResumeConversation);
      socket.disconnect();
      socketLogger.log("Socket desconectado e limpo");
    };
  }, [
    connectSocket,
    scheduleReconnect,
    clearReconnectTimer,
    onMessageUpsert,
    onSendMessage,
    onNewProspect,
    onPauseConversation,
    onResumeConversation,
  ]);

  // Retorna socket e estado para uso externo se necessário
  return {
    socket,
    isConnected: socketState.current.isConnected,
    reconnectAttempts: socketState.current.reconnectAttempts,
    lastError: socketState.current.lastError,
  };
};
