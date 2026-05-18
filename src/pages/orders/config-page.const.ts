import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";
import { useOrderQuery } from "@/hooks/orders/useOrderQuery";
import { useUpdateOrderMutation } from "@/hooks/orders/useUpdateOrderMutation";
import type { Dayjs } from "dayjs";
import type {
  IOrderAddressComplement,
  IOrderTelecom,
} from "@/types/IOrder.type";
import type { OrderModule } from "@/services/orders.service";

export const entityPage = dictionaryQueryClient.orders;
export const useUpdateEntity = useUpdateOrderMutation;
export const useDeleteEntity = useDeleteOrderMutation;
export const useListEntity = useOrderQuery;
export type EntityType = IOrderTelecom;

export type OrderModel = OrderModule;

export type TelecomOrderCategory = "banda-larga" | "telefonia-movel";
export type FinanceOrderCategory = "maquininha" | "emprestimo";
export type BenefitsOrderCategory = "beneficios";
export type OrderCategory =
  | TelecomOrderCategory
  | FinanceOrderCategory
  | BenefitsOrderCategory;

export const defaultOrderModel: OrderModel = "telecom";

export const defaultCategoryByModel: Record<OrderModel, OrderCategory> = {
  telecom: "banda-larga",
  finances: "maquininha",
  benefits: "beneficios",
};

const categoriesByModel: Record<OrderModel, OrderCategory[]> = {
  telecom: ["banda-larga", "telefonia-movel"],
  finances: ["maquininha", "emprestimo"],
  benefits: ["beneficios"],
};

const telecomOrderCategories: TelecomOrderCategory[] = [
  "banda-larga",
  "telefonia-movel",
];

export const defaultOrderCategory: TelecomOrderCategory =
  defaultCategoryByModel.telecom as TelecomOrderCategory;

const telecomOrderCategoryLabelMap: Record<TelecomOrderCategory, string> = {
  "banda-larga": "Banda Larga",
  "telefonia-movel": "Telefonia Móvel",
};

export function isTelecomOrderCategory(
  category?: string,
): category is TelecomOrderCategory {
  return (
    !!category &&
    telecomOrderCategories.includes(category as TelecomOrderCategory)
  );
}

export function resolveOrderCategory(
  rawCategory?: string,
  model: OrderModel = defaultOrderModel,
): OrderCategory {
  const categories = categoriesByModel[model];
  if (!rawCategory) return defaultCategoryByModel[model];

  return categories.includes(rawCategory as OrderCategory)
    ? (rawCategory as OrderCategory)
    : defaultCategoryByModel[model];
}

export function isKnownOrderModel(model: string): model is OrderModel {
  return model in categoriesByModel;
}

export function resolveOrderModel(rawModel?: string): OrderModel {
  const normalized = (rawModel ?? "").toLowerCase();
  return isKnownOrderModel(normalized) ? normalized : defaultOrderModel;
}

export function getOrderCategoryLabel(category: string): string {
  return (
    telecomOrderCategoryLabelMap[category as TelecomOrderCategory] ?? category
  );
}

export type FormValues = {
  plan_id?: number | string;
  selected_extras?: Array<number | string>;
  installation_preferred_date_one?: string | Dayjs;
  installation_preferred_period_one?: string;
  installation_preferred_date_two?: string | Dayjs;
  installation_preferred_period_two?: string;
  due_day?: number;
  availability_pap?: boolean;
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  email?: string;
  mother_full_name?: string;
  phone?: string;
  additional_phone?: string;
  cnpj?: string;
  address?: string;
  address_number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  single_zip_code?: boolean;
  consultant_observation?: string;
  address_complement?: Partial<IOrderAddressComplement>;
};
