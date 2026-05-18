import { httpClientAxios } from "@/http/api";
import type {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserFilters,
  IUserResponse,
} from "@/types/IUser.type";

export class UsersService {
  static async getAll(filters?: IUserFilters): Promise<IUserResponse> {
    const { data } = await httpClientAxios.get<IUserResponse>(`/users`, {
      params: filters,
    });
    return data;
  }

  static async create(entity: ICreateUser): Promise<IUser> {
    const { data } = await httpClientAxios.post<IUser>(`/users`, entity);
    return data;
  }

  static async update(entity: IUpdateUser): Promise<void> {
    await httpClientAxios.put(`/users/${entity.user_id}`, entity);
  }

  static async deleteItems({ ids }: { ids: number[] }): Promise<void> {
    for (const idx in ids) {
      await httpClientAxios.delete(`users/${ids[idx]}`);
    }
  }
}
