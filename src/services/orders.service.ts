import { httpClientAxios } from "@/http/api";
import type {
  TelecomOrderFilters,
  FinanceOrderFilters,
  BenefitsOrderFilters,
} from "@/types/orders";
import type {
  TelecomFormValues,
  FinanceOrderFormValues,
  BenefitsOrderFormValues,
} from "@/types/orders";

type OrderFilters =
  | TelecomOrderFilters
  | FinanceOrderFilters
  | BenefitsOrderFilters;
export type OrderModule = "telecom" | "finances" | "benefits";

function resolveOrdersBasePath(module: OrderModule, operator: string): string {
  return `/${module}/${operator}/orders`;
}

export class OrdersService {
  static async getAll<T = Record<string, unknown>>(
    module: OrderModule,
    operator: string,
    filters?: OrderFilters,
  ): Promise<T> {
    const { data } = await httpClientAxios.get<T>(
      resolveOrdersBasePath(module, operator),
      { params: filters },
    );
    return data;
  }

  // Busca todos os pedidos de um segmento sem filtrar por operadora/empresa.
  // usado apenas na versão admin
  static async getAllBySegment<T = Record<string, unknown>>(
    module: OrderModule,
    filters?: OrderFilters,
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
    payload:
      | TelecomFormValues
      | FinanceOrderFormValues
      | BenefitsOrderFormValues
      | Record<string, unknown>,
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
