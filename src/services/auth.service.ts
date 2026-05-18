import { httpClientAxios } from "../http/api";
import type { IAuthPayload } from "../types/IAuthPayload.type";

export class AuthService {
  static async login(email: string, password: string): Promise<IAuthPayload> {
    const { data } = await httpClientAxios.post<IAuthPayload>(
      "/auth/user/login",
      { email, password },
    );
    return data;

    // console.log(email, password);

    // return {
    //   name: "Admin",
    //   email: "admin@example.com",
    //   cpf: "12345678900",
    //   role: "admin",
    //   telephone: "1234567890",
    //   company_id: "1",
    //   partner_id: "1",
    //   partner_url_logo: "https://vivo.empresas.gold/assets/logo-site.png",
    // };
  }

  static async logout() {
    await httpClientAxios.post<IAuthPayload>("/auth/user/logout");
  }
}
