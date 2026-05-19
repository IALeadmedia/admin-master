import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCreateProductMutation } from "@/hooks/products/useCreateProductMutation";
import { useDeleteProductMutation } from "@/hooks/products/useDeleteProductMutation";
import { useProductQuery } from "@/hooks/products/useProductQuery";
import { useUpdateProductMutation } from "@/hooks/products/useUpdateProductMutation";
import type { IProduct } from "@/types/IProduct.type";

export const entityPage = dictionaryQueryClient.products;
export const productModel = "finances" as const;
export const FINANCIES_DEFAULT_CATEGORY = "maquininha" as const;

const financiesCategoryLabelMap: Record<string, string> = {
  maquininha: "Maquininha",
  emprestimo: "Empréstimo",
};

export function getFinanciesCategoryLabel(category: string) {
  return financiesCategoryLabelMap[category] ?? category;
}

export const useCreateEntity = () => useCreateProductMutation(productModel);
export const useUpdateEntity = () => useUpdateProductMutation(productModel);
export const useListEntity = (category: string = FINANCIES_DEFAULT_CATEGORY) =>
  useProductQuery({
    model: productModel,
    filters: { category },
  });
export const useDeleteEntity = () => useDeleteProductMutation(productModel);
export type EntityType = IProduct;

export type FormValues = {
  name: string;
  company: string;
  badge?: string;
  category?: string;
  company_id?: number | null;
  uf?: string[];
  online: boolean;
  monthly_fee: number;
  tax_rate: number;
};
