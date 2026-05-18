import { httpClientAxios } from "@/http/api";
import type {
  IPartnerPriority,
  IPartnerPriorityFilters,
  IPartnerPriorityListResponse,
  IPartnerPriorityResolveResponse,
  IUpdatePartnerPriorityPayload,
} from "@/types/IPartnerPriority.type";

export class PartnersPriorityService {
  static async getAll(
    filters?: IPartnerPriorityFilters,
  ): Promise<IPartnerPriority[]> {
    const { data } = await httpClientAxios.get<IPartnerPriorityListResponse>(
      `/partner-priorities`,
      {
        params: filters,
      },
    );
    return data.priorities ?? [];
  }

  static async resolve(
    filters: Required<IPartnerPriorityFilters>,
  ): Promise<IPartnerPriorityResolveResponse> {
    const { data } = await httpClientAxios.get<IPartnerPriorityResolveResponse>(
      `/partner-priorities/resolve`,
      {
        params: filters,
      },
    );

    return data;
  }

  static async update(entity: IUpdatePartnerPriorityPayload): Promise<void> {
    await httpClientAxios.put(`/partner-priorities`, entity);
  }

  static async deleteItems({ ids }: { ids: number[] }): Promise<void> {
    await Promise.all(
      ids.map((id) => httpClientAxios.delete(`/partner-priorities/${id}`)),
    );
  }
}
