import { apiUberich } from "@/configs/api";

export class EvolutionService {
  async getAllInstances(clientId: string): Promise<any[]> {
    const response = await apiUberich.get(
      `/evolution/fetch-instances?clientId=${clientId}`,
    );
    return response.data;
  }

  async createInstance(
    instanceName: string,
    qrcode: boolean,
    number: string,
    clientId: string,
  ): Promise<void> {
    const response = await apiUberich.post(`/evolution/create-instance`, {
      instanceName: instanceName,
      qrcode: qrcode,
      number: number,
      clientId: clientId,
    });
    return response.data;
  }

  async removeInstance(instanceName: string): Promise<void> {
    const response = await apiUberich.delete(
      `/evolution/delete-instance/${instanceName}`,
    );

    return response.data;
  }
  async disconnectInstance(instanceName: string): Promise<void> {
    const response = await apiUberich.delete(
      `/evolution/logout-instance/${instanceName}`,
    );

    return response.data;
  }

  async getQRCodeInstances(instanceName: string): Promise<any[]> {
    const response = await apiUberich.get(
      `/evolution/connect-instance/${instanceName}`,
    );
    return response.data;
  }
}
