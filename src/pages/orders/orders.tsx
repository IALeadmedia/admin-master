import { Typography } from "antd";


import {
  entityPage,
  getOrderCategoryLabel,
  resolveOrderCategory,
  useListEntity,
} from "./config-page.const";
import { TableMain } from "./components/table";

interface OrdersPageProps {
  category?: string;
}

export function OrdersPage({ category }: OrdersPageProps) {
  const resolvedCategory = resolveOrderCategory(category);
  const { data, isLoading } = useListEntity({
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
