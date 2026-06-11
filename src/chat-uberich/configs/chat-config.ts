// Configurações centralizadas para otimização do sistema de chat
export const CHAT_CONFIG = {
  // Cache e performance
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  MESSAGE_CACHE_TTL: 2 * 60 * 1000, // 2 minutos
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 minutos
  QUERY_CACHE_TIME: 10 * 60 * 1000, // 10 minutos
  
  // Socket e reconexão
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000, // 1 segundo inicial
  
  // Retry de queries
  MAX_QUERY_RETRIES: 3,
  MESSAGES_QUERY_RETRIES: 2,
  
  // Performance
  DEBOUNCE_DELAY: 300, // Para pesquisas
  THROTTLE_DELAY: 100, // Para scroll e outros eventos
  
  // UI feedback
  OPTIMISTIC_MESSAGE_TIMEOUT: 10000, // 10 segundos para timeout
  NOTIFICATION_TAG_TTL: 30000, // 30 segundos para tags de notificação
  
  // Debugging (apenas em desenvolvimento)
  ENABLE_PERFORMANCE_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_SOCKET_LOGS: process.env.NODE_ENV === 'development',
  
  // Limites
  MAX_CACHED_CHATS: 100,
  MAX_MESSAGES_PER_CHAT: 1000,
} as const;

// Utilitários para logs de performance
export const perfLogger = {
  log: (message: string, data?: unknown) => {
    if (CHAT_CONFIG.ENABLE_PERFORMANCE_LOGS) {
      console.log(`[CHAT-PERF] ${message}`, data);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (CHAT_CONFIG.ENABLE_PERFORMANCE_LOGS) {
      console.warn(`[CHAT-PERF] ${message}`, data);
    }
  },
  error: (message: string, error: unknown) => {
    console.error(`[CHAT-PERF] ${message}`, error);
  },
};

// Utilitários para logs de socket
export const socketLogger = {
  log: (message: string, data?: unknown) => {
    if (CHAT_CONFIG.ENABLE_SOCKET_LOGS) {
      console.log(`[CHAT-SOCKET] ${message}`, data);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (CHAT_CONFIG.ENABLE_SOCKET_LOGS) {
      console.warn(`[CHAT-SOCKET] ${message}`, data);
    }
  },
  error: (message: string, error: unknown) => {
    console.error(`[CHAT-SOCKET] ${message}`, error);
  },
};

// Tipos para melhor tipo safety
export type ChatConfig = typeof CHAT_CONFIG;
