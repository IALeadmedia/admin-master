import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCreateProductMutation } from "@/hooks/products/useCreateProductMutation";
import { useDeleteProductMutation } from "@/hooks/products/useDeleteProductMutation";
import { useProductQuery } from "@/hooks/products/useProductQuery";
import { useUpdateProductMutation } from "@/hooks/products/useUpdateProductMutation";
import type { Extra, IProduct } from "@/types/IProduct.type";
import type { UploadFile } from "antd";

export const entityPage = dictionaryQueryClient.products;
export const productModel = "telecom" as const;
export const TELECOM_DEFAULT_CATEGORY = "banda-larga" as const;

const telecomCategoryLabelMap: Record<string, string> = {
  "banda-larga": "Banda Larga",
  "telefonia-movel": "Telefonia Móvel",
};

export function getTelecomCategoryLabel(category: string) {
  return telecomCategoryLabelMap[category] ?? category;
}

export const useCreateEntity = () => useCreateProductMutation(productModel);
export const useUpdateEntity = () => useUpdateProductMutation(productModel);
export const useListEntity = (
  category: string = TELECOM_DEFAULT_CATEGORY,
  page = 1,
  per_page = 20,
) =>
  useProductQuery({
    model: productModel,
    filters: { category },
    page,
    per_page,
  });
export const useDeleteEntity = () => useDeleteProductMutation(productModel);
export type EntityType = IProduct;

export type FormValues = {
  name: string;
  company: string;
  badge?: string;
  offer_title?: string;
  offer_subtitle?: string;
  client_type: "PF" | "PJ";
  uf?: string[];
  company_id?: number | null;
  category?: string;
  pricing?: {
    base_monthly?: { current_price?: number; original_price?: number };
    installation?: { current_price?: number };
  };
  offer_conditions?: UploadFile[];
  details?: {
    title?: string;
    description?: string;
    highlight_top?: boolean;
    highlight_bottom?: boolean;
    images?: (UploadFile | string)[];
  }[];
  extras_non_client?: {
    id?: string;
    label?: string;
    description?: string;
    input_type?: Extra["input_type"] | "select";
    images?: (UploadFile | string)[];
    options?: {
      id?: string;
      label?: string;
      price?: number;
      description?: string;
      bonus?: {
        type?: string;
        price?: number;
        speed?: number;
        description?: string;
      };
    }[];
  }[];
  extras_client?: {
    id?: string;
    label?: string;
    description?: string;
    input_type?: Extra["input_type"] | "select";
    images?: (UploadFile | string)[];
    options?: {
      id?: string;
      label?: string;
      price?: number;
      description?: string;
      bonus?: {
        type?: string;
        price?: number;
        speed?: number;
        description?: string;
      };
    }[];
  }[];
};
