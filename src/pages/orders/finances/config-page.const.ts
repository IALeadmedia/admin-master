import type { TableColumnsType } from "antd";
import type { FinanceOrder } from "@/types/orders";
import { getFinanceOrderColumns } from "./components/columns";

export const FINANCE_DEFAULT_CATEGORY = "maquininha" as const;

export type FinanceOrderType = FinanceOrder;

export function getFinanceColumns(): TableColumnsType<FinanceOrderType> {
  return getFinanceOrderColumns();
}
