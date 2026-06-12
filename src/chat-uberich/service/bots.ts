import { apiUberich } from "../configs/api";

export interface ICreateBot {
  name: string;
  platform: string;
  platformId: string;
  aiProvider?: string;
  obs?: string;
  tokenIn?: number;
  phone?: string;
  tokenOut?: number;
}
export interface IBot {
  id: string;
  name: string;
  clientId: string;
  platform: string;
  phone: string;
  platformId: string;
  evolutionData: {
    chatCount: number;
    phoneNumber: string;
    profileName: string;
    contactCount: number;
    messageCount: number;
    profilePicUrl: string;
  };
  aiProvider: string;
  obs: string;
  tokenIn: number;
  tokenOut: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface IEditBot {
  name?: string;
  obs?: string;
  phone?: string;
}

export class BotsService {
  async fetchAllBots(): Promise<IBot[]> {
    const response = await apiUberich.get("/bots");
    return response.data;
  }

  async createNewBot(data: ICreateBot) {
    await apiUberich.post(`/bots`, data);
  }

  async updateBot(id: string, data: IEditBot) {
    await apiUberich.patch(`/bots/${id}`, data);
  }

  async pauseBotGlobal(instanceName: string) {
    await apiUberich.post(`/n8n/pause-global-conversation`, { instanceName });
  }

  async resumeBotGlobal(instanceName: string) {
    await apiUberich.post(`/n8n/resume-global-conversation`, { instanceName });
  }

  async remove(id: string) {
    await apiUberich.delete(`/bots/${id}`);
  }
}
