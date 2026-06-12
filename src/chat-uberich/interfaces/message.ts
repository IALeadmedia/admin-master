import type { MessageType } from "./message-type";

export interface IReceivedMessage {
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
}

export interface IMessage {
  id: string;
  prospectId: string;
  conversationNumber: number;
  sender: string;
  sentAt: string;
  platform: string;
  data: {
    messageType: MessageType;
    s3: boolean;
    content: string;
    caption?: string;
  };
  editedAt: string | null;
  deletedAt: string | null;
}
