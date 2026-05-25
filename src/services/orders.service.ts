import { httpClientAxios } from "@/http/api";

export type OrderModule = "telecom" | "finances" | "benefits";

function resolveOrdersBasePath(module: OrderModule, operator: string): string {
  return `/${module}/${operator}/orders`;
}

export class OrdersService {
  static async getAll<T = Record<string, unknown>>(
    module: OrderModule,
    operator: string,
    filters?: object,
  ): Promise<T> {
    const { data } = await httpClientAxios.get<T>(
      resolveOrdersBasePath(module, operator),
      { params: filters },
    );
    return data;
  }

  /** Busca todos os pedidos de um segmento sem filtrar por operadora/empresa.
   *  Rota: GET /{module}/orders
   *  Exclusivo para admin quando apenas o segmento está selecionado.
   */
  static async getAllBySegment<T = Record<string, unknown>>(
    module: OrderModule,
    filters?: object,
  ): Promise<T> {
    const { data } = await httpClientAxios.get<T>(`/${module}/orders`, {
      params: filters,
    });
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
