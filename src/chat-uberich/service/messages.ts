//

import { apiUberich } from "@/configs/api";
import { IResponseChatQuery, IResponseMessage } from "@/interfaces/chat/chat";

// interface ISendMessageText {
//   text: string;
// }

// interface ISendMessageText {
//   botPlatformId: string;
//   number: string;
//   text: string;
// }

interface ISendMessageFile {
  name: string;
  base64Content: string;
}

interface ISendMessageImage {
  base64Content: string;
}

export interface IHotLead {
  hotLead: number;
}

export class MessagesService {
  async fetchAll(clientId: string): Promise<IResponseChatQuery[]> {
    const response = await apiUberich.get(`/messages/chats/${clientId}`);
    return response.data;
  }

  async fetchSearchedWords(clientId: string, keyword: string): Promise<any[]> {
    const response = await apiUberich.get(`/messages/${clientId}`, {
      params: { keyword },
    });
    return response.data;
  }

  async fetchAllMessagesFromProspect(
    prospectId: string,
  ): Promise<IResponseMessage[]> {
    const response = await apiUberich.get(
      `/messages/chats/prospect/${prospectId}`,
    );
    return response.data;
  }

  async fetchAllHotLeadOfTheDay(clientId: string) {
    const response = await apiUberich.get(
      `/prospects/hotleads-of-the-day/${clientId}`,
    );
    return response.data;
  }

  async pauseConversation(prospectId: string): Promise<void> {
    const response = await apiUberich.patch(
      `/prospects/pause-conversation/${prospectId}`,
    );
    return response.data;
  }

  async resumeConversation(prospectId: string): Promise<void> {
    const response = await apiUberich.patch(
      `/prospects/resume-conversation/${prospectId}`,
    );
    return response.data;
  }

  async removeFavoriteProspect(prospectId: string): Promise<void> {
    const response = await apiUberich.patch(
      `users/favourites/remove/${prospectId}`,
    );
    return response.data;
  }

  async addFavoriteProspect(prospectId: string): Promise<void> {
    const response = await apiUberich.patch(
      `users/favourites/add/${prospectId}`,
    );
    return response.data;
  }

  async disableHandHelpProspect(prospectId: string): Promise<void> {
    const response = await apiUberich.patch(
      `/prospects/disable-conversa-pendente/${prospectId}`,
    );

    return response.data;
  }

  async updateMessage(messageId: string, text: string): Promise<void> {
    const response = await apiUberich.post(`/evolution/update-message`, {
      messageId: messageId,
      text,
    });
    return response.data;
  }

  async updateConversationSummary(
    instanceName: string,
    externalId: string,
  ): Promise<boolean> {
    const response = await apiUberich.post(
      `/prospects/conversation-summary/evolution/${instanceName}/${externalId}`,
    );
    return response.data.success;
  }

  async deleteMessage(messageId: string): Promise<void> {
    const response = await apiUberich.delete(`/evolution/delete-message`, {
      data: { messageId },
    });
    return response.data;
  }

  async sendMessage(prospectId: string, message: string): Promise<boolean> {
    const wasSend = await apiUberich.post("/evolution/send-message", {
      text: message,
      prospectId,
    });
    return wasSend.data.succcess;
  }

  async sendImage(
    prospectId: string,
    imageMessage: ISendMessageImage,
  ): Promise<boolean> {
    const wasSend = await apiUberich.post("/evolution/send-image", {
      prospectId,
      ...imageMessage,
    });
    return wasSend.data.success;
  }

  async sendFile(
    prospectId: string,
    fileMessage: ISendMessageFile,
  ): Promise<boolean> {
    const wasSend = await apiUberich.post("/evolution/send-file", {
      prospectId,
      ...fileMessage,
    });
    return wasSend.data.success;
  }
}
