import { httpClientAxios } from "@/http/api";
import type {
  ICompanyResponse,
  ICreateCompany,
  IUpdateCompany,
  ICompany,
  ICompanyFilters,
} from "@/types/ICompany.type";

export class CompaniesService {
  static async getAll(filters?: ICompanyFilters): Promise<ICompanyResponse> {
    const { data } = await httpClientAxios.get<ICompanyResponse>(
      `/business-companies`,
      {
        params: filters,
      },
    );
    return data;
  }

  static async create(entity: ICreateCompany): Promise<ICompany> {
    const { data } = await httpClientAxios.post<ICompany>(
      `/business-companies`,
      entity,
    );
    return data;
  }

  static async update(entity: IUpdateCompany): Promise<void> {
    await httpClientAxios.put(
      `/business-companies/${entity.company_id}`,
      entity,
    );
  }

  static async deleteItems({ ids }: { ids: number[] }): Promise<void> {
    for (const idx in ids) {
      await httpClientAxios.delete(`/business-companies/${ids[idx]}`);
    }
  }
}
