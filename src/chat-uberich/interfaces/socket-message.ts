import type { MessageType } from "./message-type";

export interface ISocketMessage {
  event: "messages.upsert" | "send.message";
  instance: string;
  prospectId: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName: string;
    status: string;
    message: {
      conversation: string;
      messageContextInfo: {
        deviceListMetadata: {
          senderKeyHash: string;
          senderTimestamp: string;
          recipientKeyHash: string;
          recipientTimestamp: string;
        };
        deviceListMetadataVersion: number;
        messageSecret: string;
      };
    };
    messageType: MessageType;
    messageTimestamp: number;
    instanceId: string;
    source: string;
  };
  server_url: string;
  date_time: string;
  sender: string;
  apikey: string;
}
