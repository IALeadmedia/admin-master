import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";
import { useOrderQuery } from "@/hooks/orders/useOrderQuery";
import { useUpdateOrderMutation } from "@/hooks/orders/useUpdateOrderMutation";
import type { IOrderTelecom } from "@/types/IOrder.type";

export const entityPage = dictionaryQueryClient.orders;
export const useUpdateEntity = useUpdateOrderMutation;
export const useDeleteEntity = useDeleteOrderMutation;
export const useListEntity = useOrderQuery;
export type EntityType = IOrderTelecom;

export const TELECOM_DEFAULT_CATEGORY = "banda-larga" as const;

const telecomCategoryLabelMap: Record<string, string> = {
  "banda-larga": "Banda Larga",
  "telefonia-movel": "Telefonia Móvel",
};

export function getTelecomCategoryLabel(category: string) {
  return telecomCategoryLabelMap[category] ?? category;
}
