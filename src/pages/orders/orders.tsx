import { Typography } from "antd";


import {
  entityPage,
  getOrderCategoryLabel,
  resolveOrderModel,
  resolveOrderCategory,
  useListEntity,
} from "./config-page.const";
import { TableMain } from "./components/table";
import { useParams } from "@tanstack/react-router";

interface OrdersPageProps {
  model?: string;
  category?: string;
}

export function OrdersPage({ model, category }: OrdersPageProps) {
  const routeParams = useParams({
    from: "/app/order/$model/$category",
    shouldThrow: false,
  });

  const rawModel = model ?? routeParams?.model;
  const rawCategory = category ?? routeParams?.category;

  const resolvedModel = resolveOrderModel(rawModel);
  const resolvedCategory = resolveOrderCategory(rawCategory, resolvedModel);
  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: { category: resolvedCategory },
  });

  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural} - {getOrderCategoryLabel(resolvedCategory)}
      </Typography.Title>
      <TableMain data={data?.orders || []} isLoading={isLoading} />
    </div>
  );
}
