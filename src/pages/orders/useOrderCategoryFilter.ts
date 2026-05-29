import { useMemo, useState } from "react";
import type {
  EntityType,
  OrderCategory,
  OrderModel,
} from "./config-page.const";
import {
  defaultCategoryByModel,
  getOrderCategoryLabelByModel,
  getPartnerCategoryOptions,
  resolvePartnerCategory,
  segmentRegistry,
} from "./config-page.const";

interface UseOrderCategoryFilterParams {
  model: OrderModel;
  orders: EntityType[];
  partnerCategories: string[];
  includeAllOption?: boolean;
}

interface UseOrderCategoryFilterResult {
  categorySelect:
    | {
        options: Array<{ label: string; value: string }>;
        value: string | undefined;
        onChange: (value: string | undefined) => void;
      }
    | undefined;
  filteredOrders: EntityType[];
  effectiveCategory: OrderCategory | undefined;
}

export function useOrderCategoryFilter({
  model,
  orders,
  partnerCategories,
  includeAllOption,
}: UseOrderCategoryFilterParams): UseOrderCategoryFilterResult {
  const { hasCategories } = segmentRegistry[model];
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const categoryOptions = useMemo(() => {
    if (!hasCategories) return [];

    const categoriesFromOrders = Array.from(
      new Set(orders.map((order) => order.category).filter(Boolean)),
    ) as string[];

    const categories = partnerCategories.length
      ? partnerCategories
      : categoriesFromOrders;

    const options = getPartnerCategoryOptions(categories, model);
    const baseOptions = options.length
      ? options
      : [
          {
            label: getOrderCategoryLabelByModel(
              defaultCategoryByModel[model],
              model,
            ),
            value: defaultCategoryByModel[model],
          },
        ];

    return includeAllOption
      ? [{ label: "Todas as categorias", value: "" }, ...baseOptions]
      : baseOptions;
  }, [hasCategories, includeAllOption, model, orders, partnerCategories]);

  const resolvedSelectedCategory = useMemo(() => {
    if (!hasCategories || !categoryOptions.length) return undefined;

    const hasSelected =
      selectedCategory !== undefined &&
      categoryOptions.some((o) => o.value === selectedCategory);
    return hasSelected ? selectedCategory : categoryOptions[0].value;
  }, [categoryOptions, hasCategories, selectedCategory]);

  const filteredOrders = useMemo(() => {
    if (!hasCategories) return orders;
    if (resolvedSelectedCategory === "") return orders;

    const hasCategoryData = orders.some((o) => Boolean(o.category));
    if (!resolvedSelectedCategory || !hasCategoryData) return orders;
    return orders.filter((o) => o.category === resolvedSelectedCategory);
  }, [hasCategories, orders, resolvedSelectedCategory]);

  const effectiveCategory = useMemo(
    () =>
      !hasCategories || resolvedSelectedCategory === ""
        ? undefined
        : resolvePartnerCategory(
            resolvedSelectedCategory,
            partnerCategories,
            model,
          ),
    [hasCategories, model, partnerCategories, resolvedSelectedCategory],
  );

  const categorySelect = hasCategories
    ? {
        options: categoryOptions,
        value: effectiveCategory ?? (includeAllOption ? "" : undefined),
        onChange: setSelectedCategory,
      }
    : undefined;

  return { categorySelect, filteredOrders, effectiveCategory };
}
