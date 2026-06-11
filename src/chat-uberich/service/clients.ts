import { apiUberich } from "@/configs/api";

export interface IBaseProperty {
  type: string;
}
export interface IClient {
  email: string;
  filterTag: string;
  id: string;
  logoDark: string;
  logoLight: string;
  name: string;
  phone: string;
}

export interface IEnum extends IBaseProperty {
  type: "enum";
  enum: string[];
}
// export type IClientId = Record<string, IBaseProperty | IEnum>;

export interface INewClient {
  fields: Array<{
    field: string;
    filterKey: string;
    fromList: string;
    searches: string;
    type: string;
    values?: string[];
  }>;
  countTowardsTemperature: Array<[string, number]>;
  dailyStats: { prospectsCount: number; hotLeadsCount: number };
}

export type INewClientId = INewClient;

export interface ICreateClient {
  email: string;
  filterTag: string;
  logoDark: string;
  logoLight: string;
  name: string;
  phone: string;
}

export class ClientsService {
  async getClientById(clientId: string): Promise<INewClient | null> {
    if (!clientId) return null;
    const response = await apiUberich.get(`/clients/${clientId}`);

    if (!response.data) {
      return null;
    }

    return response.data;
  }

  async getClients(): Promise<IClient[]> {
    const response = await apiUberich.get("/clients");
    return response.data;
  }

  async getAllProspectsFromClient(
    clientId: string,
    page: number,
    number: number,
  ): Promise<any[]> {
    const response = await apiUberich.get(`/prospects/${clientId}`, {
      params: { page, number },
    });
    return response.data;
  }
}
