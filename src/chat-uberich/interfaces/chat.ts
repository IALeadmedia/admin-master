import type { IMessage } from "./message";
import type { MessageType } from "./message-type";

interface IPlatformData {
  name: string;
  wuid: string;
  status: {
    setAt: Date;
    status: string;
  };
  picture?: string;
  isBusiness: boolean;
  numberExists: boolean;
}

interface IBot {
  id: string;
  name: string;
  platform: string;
  platformId: string;
}

interface IProspect {
  id: string;
  externalId: string;
  botId: string;
  botPlatform: string;
  botPlatformId: string;
  platformData: IPlatformData;
  data: any;
  cost: number;
  traces: number;
  tokenIn: number;
  tokenOut: number;
  createdAt: string;
  lastInteraction: string;
  user_ns: null;
  lastSender: string;
  conversationCount: number;
  deletedAt: null;
  bot: IBot;
}

export interface IResponseMessage {
  id: string;
  prospectId: string;
  conversationNumber: number;
  sender: string;
  sentAt: string;
  platform: string;
  data: {
    s3: boolean;
    content: string;
    messageType: MessageType;
  };
  editedAt: string | null;
  deletedAt: string | null;
}

// ARRUMARR ISSO
export interface IResponseChatQuery extends IResponseMessage {
  prospect: IProspect;
}

export interface IResponseChatSocket {
  clientId: string;
  message: IResponseMessage;
  prospect: IProspect;
}

export interface IChat {
  id: string; // prospectId
  prospect: IProspect;
  messages: IMessage[];
  wasFetch: boolean;
  _customKey: string;
  isResultByMessage?: boolean;
}

export interface ILeadTemperatureSocket {
  prospectId: string;
  temperature: number;
}
