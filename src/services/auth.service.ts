import { httpClientAxios } from "../http/api";
import type { IAuthPayload } from "../types/IAuthPayload.type";

export class AuthService {
  static async login(email: string, password: string): Promise<IAuthPayload> {
    const { data } = await httpClientAxios.post<IAuthPayload>(
      "/auth/user/login",
      { email, password },
    );
    return data;
  }

  static async logout() {
    await httpClientAxios.post<IAuthPayload>("/auth/user/logout");
  }
}
