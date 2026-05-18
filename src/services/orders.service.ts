import { httpClientAxios } from "@/http/api";
import type {
  IOrderTelecomFilters,
  IOrderTelecomResponse,
} from "@/types/IOrder.type";

export type OrderModule = "telecom" | "finances" | "benefits";

function resolveOrdersBasePath(module: OrderModule, operator: string): string {
  return `/${module}/${operator}/orders`;
}

export class OrdersService {
  static async getAll(
    module: OrderModule,
    operator: string,
    filters?: IOrderTelecomFilters,
  ): Promise<IOrderTelecomResponse> {
    const { data } = await httpClientAxios.get<IOrderTelecomResponse>(
      resolveOrdersBasePath(module, operator),
      {
        params: {
          ...filters,
        },
      },
    );
    return data;
  }

  static async update(
    id: number,
    module: OrderModule,
    operator: string,
    payload: Record<string, unknown>,
  ): Promise<unknown> {
    const { data } = await httpClientAxios.put<unknown>(
      `${resolveOrdersBasePath(module, operator)}/${id}`,
      payload,
    );
    return data;
  }

  static async delete(
    id: number,
    module: OrderModule,
    operator: string,
  ): Promise<void> {
    await httpClientAxios.delete(
      `${resolveOrdersBasePath(module, operator)}/${id}`,
    );
  }

  static async changeStatus(
    id: number,
    module: OrderModule,
    operator: string,
    payload: { status: string },
  ): Promise<void> {
    await httpClientAxios.patch(
      `${resolveOrdersBasePath(module, operator)}/${id}/status`,
      payload,
    );
  }
}

export { OrdersService as BandaLargaService };
