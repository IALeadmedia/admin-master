import { httpClientAxios } from "@/http/api";

export interface UF {
  id: number;
  sigla: string;
  nome: string;
}

export interface City {
  id: number;
  nome: string;
}

interface StatesResponse {
  success: boolean;
  states: UF[];
}

interface CitiesResponse {
  success: boolean;
  uf: string;
  cities: City[];
}
interface StatesResponse {
  success: boolean;
  states: UF[];
}

interface CitiesResponse {
  success: boolean;
  uf: string;
  cities: City[];
}

export class LocationsService {
  static async getUFs(): Promise<UF[]> {
    const { data } =
      await httpClientAxios.get<StatesResponse>("/locations/states");
    return data.states;
  }

  static async getCitiesByUF(uf: string): Promise<City[]> {
    const { data } = await httpClientAxios.get<CitiesResponse>(
      `/locations/states/${uf}/cities`,
    );
    return data.cities;
  }
}
