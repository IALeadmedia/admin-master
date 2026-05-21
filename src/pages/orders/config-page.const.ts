import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";
import { useOrderQuery } from "@/hooks/orders/useOrderQuery";
import { useUpdateOrderMutation } from "@/hooks/orders/useUpdateOrderMutation";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import type {
  IOrderAddressComplement,
  IOrderTelecom,
} from "@/types/IOrder.type";
import type { ICompany } from "@/types/ICompany.type";
import type { OrderModule } from "@/services/orders.service";
import { getFinanceColumns } from "./finances/config-page.const";
import { getColumns as getTelecomColumns } from "./telecom/components/columns.tsx";

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

const telecomOrderCategoryLabelMap: Record<TelecomOrderCategory, string> = {
  "banda-larga": "Banda Larga",
  "telefonia-movel": "Telefonia Móvel",
};

const financeOrderCategoryLabelMap: Record<FinanceOrderCategory, string> = {
  maquininha: "Maquininha",
  emprestimo: "Empréstimo",
};

const benefitsOrderCategoryLabelMap: Record<BenefitsOrderCategory, string> = {
  beneficios: "Benefícios",
};

const orderCategoryLabelMapByModel: Record<
  OrderModel,
  Record<string, string>
> = {
  telecom: telecomOrderCategoryLabelMap,
  finances: financeOrderCategoryLabelMap,
  benefits: benefitsOrderCategoryLabelMap,
};

export function isTelecomOrderCategory(
  category?: string,
): category is TelecomOrderCategory {
  return (
    !!category &&
    categoriesByModel.telecom.includes(category as TelecomOrderCategory)
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

export function getOrderCategoryLabelByModel(
  category: string,
  model: OrderModel = defaultOrderModel,
): string {
  return orderCategoryLabelMapByModel[model]?.[category] ?? category;
}

export function getOrderCategoryOptionsByModel(
  model: OrderModel = defaultOrderModel,
): Array<{ label: string; value: OrderCategory }> {
  return (categoriesByModel[model] ?? []).map((category) => ({
    value: category,
    label: getOrderCategoryLabelByModel(category, model),
  }));
}

export function getPartnerCategoryOptions(
  categories: string[] = [],
  model: OrderModel = defaultOrderModel,
): Array<{ label: string; value: string }> {
  const allowedCategories = categoriesByModel[model];
  const uniqueCategories = Array.from(new Set(categories)).filter(Boolean);
  const source = uniqueCategories.length ? uniqueCategories : allowedCategories;

  return source
    .filter((category) => allowedCategories.includes(category as OrderCategory))
    .map((category) => ({
      value: category,
      label: getOrderCategoryLabelByModel(category, model),
    }));
}

export function resolvePartnerCategory(
  category: string | undefined,
  partnerCategories: string[] = [],
  model: OrderModel = defaultOrderModel,
): OrderCategory {
  const modelCategory = resolveOrderCategory(category, model);

  if (!partnerCategories.length) {
    return modelCategory;
  }

  return partnerCategories.includes(modelCategory)
    ? modelCategory
    : (partnerCategories[0] as OrderCategory);
}

export function getOrderColumnsByModel(
  model: OrderModel = defaultOrderModel,
  companies: ICompany[] = [],
): TableColumnsType<EntityType> | undefined {
  if (model === "telecom") {
    return getTelecomColumns(companies) as TableColumnsType<EntityType>;
  }

  if (model === "finances") {
    return getFinanceColumns() as TableColumnsType<EntityType>;
  }

  return undefined;
}

export type FormValues = {
  plan_id?: number | string;
  selected_extras?: Array<number | string>;
  installation_preferred_date_one?: string | Dayjs;
  installation_preferred_period_one?: string;
  installation_preferred_date_two?: string | Dayjs;
  installation_preferred_period_two?: string;
  due_day?: string | number;
  availability_pap?: boolean;
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  email?: string;
  mother_full_name?: string;
  phone?: string;
  additional_phone?: string;
  cnpj?: string;
  payment_method?: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account_number?: string;
  bank_account_holder_name?: string;
  bank_account_holder_cpf?: string;
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
