import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";
import { useOrderQuery } from "@/hooks/orders/useOrderQuery";
import { useUpdateOrderMutation } from "@/hooks/orders/useUpdateOrderMutation";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import type { OrderAddressComplement, TelecomOrder } from "@/types/orders";
import type { ICompany } from "@/types/ICompany.type";
import type { OrderModule } from "@/services/orders.service";
import type { OrderCategory, TelecomOrderCategory } from "./segment.registry";
import { getFinanceOrderColumns } from "./finances/components/columns";
import { getColumns as getTelecomColumns } from "./telecom/components/columns";
import { segmentRegistry } from "./segment.registry";

export type {
  OrderCategory,
  TelecomOrderCategory,
  FinanceOrderCategory,
  BenefitsOrderCategory,
  SegmentConfig,
} from "./segment.registry";
export { segmentRegistry };

export const entityPage = dictionaryQueryClient.orders;
export const useUpdateEntity = useUpdateOrderMutation;
export const useDeleteEntity = useDeleteOrderMutation;
export const useListEntity = useOrderQuery;
export type EntityType = TelecomOrder;

export type OrderModel = OrderModule;

export const defaultOrderModel: OrderModel = "telecom";

export const defaultCategoryByModel: Record<OrderModel, OrderCategory> = {
  telecom: segmentRegistry.telecom.defaultCategory,
  finances: segmentRegistry.finances.defaultCategory,
  benefits: segmentRegistry.benefits.defaultCategory,
};

export function isTelecomOrderCategory(
  category?: string,
): category is TelecomOrderCategory {
  return (
    !!category &&
    (segmentRegistry.telecom.categories as readonly string[]).includes(category)
  );
}

export function resolveOrderCategory(
  rawCategory?: string,
  model: OrderModel = defaultOrderModel,
): OrderCategory {
  const { categories, defaultCategory } = segmentRegistry[model];
  if (!rawCategory) return defaultCategory;

  return (categories as readonly string[]).includes(rawCategory)
    ? (rawCategory as OrderCategory)
    : defaultCategory;
}

export function isKnownOrderModel(model: string): model is OrderModel {
  return model in segmentRegistry;
}

export function resolveOrderModel(rawModel?: string): OrderModel {
  const normalized = (rawModel ?? "").toLowerCase();
  return isKnownOrderModel(normalized) ? normalized : defaultOrderModel;
}

export function getOrderCategoryLabelByModel(
  category: string,
  model: OrderModel = defaultOrderModel,
): string {
  return segmentRegistry[model]?.categoryLabelMap[category] ?? category;
}

export function getOrderCategoryOptionsByModel(
  model: OrderModel = defaultOrderModel,
): Array<{ label: string; value: OrderCategory }> {
  return (segmentRegistry[model].categories as readonly OrderCategory[]).map(
    (category) => ({
      value: category,
      label: getOrderCategoryLabelByModel(category, model),
    }),
  );
}

export function getPartnerCategoryOptions(
  categories: string[] = [],
  model: OrderModel = defaultOrderModel,
): Array<{ label: string; value: string }> {
  const allowedCategories = segmentRegistry[model]
    .categories as readonly string[];
  const uniqueCategories = Array.from(new Set(categories)).filter(Boolean);
  const source = uniqueCategories.length
    ? uniqueCategories
    : [...allowedCategories];

  return source
    .filter((category) => allowedCategories.includes(category))
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
    return getFinanceOrderColumns() as TableColumnsType<EntityType>;
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
  address_complement?: Partial<OrderAddressComplement>;
};
