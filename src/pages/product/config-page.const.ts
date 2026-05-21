import type { ComponentType } from "react";
import type { IProduct, IProductsResponse } from "@/types/IProduct.type";

import * as telecomConfig from "./telecom/config-page.const";
import * as financiesConfig from "./financies/config-page.const";

import { TableMain as TelecomTable } from "./telecom/components/table";
import { TableMain as FinanciesTable } from "./financies/components/table";

export interface ProductsTableComponentProps {
  data: IProduct[];
  isLoading: boolean;
  category: string;
  model?: ProductModel;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  categorySelect?: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
  };
}

interface ModelConfig {
  entityPage: { plural: string; name: string };
  useListEntity: (
    category: string,
    page?: number,
    per_page?: number,
  ) => {
    data?: Pick<IProductsResponse, "products" | "total">;
    isLoading: boolean;
  };
  getCategoryLabel: (category: string) => string;
  TableComponent: ComponentType<ProductsTableComponentProps>;
}

export type ProductModel = "telecom" | "finances";

export const configByModel: Record<ProductModel, ModelConfig> = {
  telecom: {
    entityPage: telecomConfig.entityPage,
    useListEntity: telecomConfig.useListEntity,
    getCategoryLabel: telecomConfig.getTelecomCategoryLabel,
    TableComponent: TelecomTable,
  },
  finances: {
    entityPage: financiesConfig.entityPage,
    useListEntity: financiesConfig.useListEntity,
    getCategoryLabel: financiesConfig.getFinanciesCategoryLabel,
    TableComponent: FinanciesTable,
  },
};

export const defaultProductModel: ProductModel = "telecom";

export const defaultCategoryByModel: Record<ProductModel, string> = {
  telecom: "banda-larga",
  finances: "maquininha",
};

export function isKnownProductModel(model: string): model is ProductModel {
  return model in configByModel;
}

export function resolveProductModel(rawModel?: string): ProductModel {
  const normalized = (rawModel ?? "").toLowerCase();
  return isKnownProductModel(normalized) ? normalized : defaultProductModel;
}
