import { httpClientAxios } from "@/http/api";
import type {
  ICreatePartner,
  ICreatePartnerResponse,
  IUpdatePartner,
  IPartner,
  IPartnerResponse,
  IPartnerFilters,
} from "@/types/IPartner.type";

export class PartnersService {
  static async getAll(filters?: IPartnerFilters): Promise<IPartnerResponse> {
    const { data } = await httpClientAxios.get<IPartnerResponse>(`/partners`, {
      params: filters,
    });
    return data;
  }

  static async create(entity: ICreatePartner): Promise<IPartner> {
    const { data } = await httpClientAxios.post<ICreatePartnerResponse>(
      `/partners`,
      entity,
    );
    return data.partner;
  }

  static async uploadLogo(partnerId: number, file: File): Promise<IPartner> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await httpClientAxios.post<IPartner>(
      `/partners/${partnerId}/logo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  }

  static async update(entity: IUpdatePartner): Promise<void> {
    await httpClientAxios.put(`/partners/${entity.partner_id}`, entity);
  }

  static async deleteItems({ ids }: { ids: number[] }): Promise<void> {
    for (const idx in ids) {
      await httpClientAxios.delete(`partners/${ids[idx]}`);
    }
  }
}
