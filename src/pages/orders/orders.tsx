import { Typography } from "antd";
import { useState } from "react";

import {
  entityPage,
  getOrderCategoryLabelByModel,
  getOrderColumnsByModel,
  resolveOrderModel,
  resolveOrderCategory,
  resolveOrderClientType,
  resolvePartnerCategory,
  segmentComponents,
  segmentRegistry,
  useListEntity,
} from "./config-page.const";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";
import { OrdersService } from "@/services/orders.service";

interface OrdersPageProps {
  model?: string;
  category?: string;
  clientType?: string;
}

export function OrdersPage({ model, category, clientType }: OrdersPageProps) {
  const resolvedModel = resolveOrderModel(model);
  const { hasCategories } = segmentRegistry[resolvedModel];
  const resolvedCategory = hasCategories ? resolveOrderCategory(category, resolvedModel) : undefined;
  const resolvedClientType = resolveOrderClientType(clientType);
  const { resolvedPartnerId } = useResolvedOrderScope(resolvedModel);
  const { data: companiesData } = useCompanyQuery();
  const { data: partnersData } = usePartnerQuery({
    partnerId: resolvedPartnerId,
    enabled: resolvedPartnerId != null,
  });

  const partnerCategories = partnersData?.partners?.[0]?.category ?? [];
  const effectiveCategory = hasCategories
    ? resolvePartnerCategory(
      resolvedCategory,
      partnerCategories,
      resolvedModel,
    )
    : undefined;
  const columns = getOrderColumnsByModel(resolvedModel, companiesData?.companies ?? []);
  const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } =
    segmentComponents[resolvedModel];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: {
      ...(effectiveCategory ? { category: effectiveCategory } : {}),
      ...(resolvedClientType ? { client_type: resolvedClientType } : {}),
    },
    page,
    per_page: pageSize,
  });

  const clientTypeLabel = resolvedClientType ? ` ${resolvedClientType}` : "";
  const titleLabel = hasCategories
    ? ` - ${getOrderCategoryLabelByModel(effectiveCategory ?? "", resolvedModel)}${clientTypeLabel}`
    : "";

  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural}{titleLabel}
      </Typography.Title>
      <CommonTableMain
        data={data?.orders || []}
        isLoading={isLoading}
        columns={columns}
        FormModalComponent={FormModalComponent}
        ViewModalComponent={ViewModalComponent}
        currentPage={page}
        pageSize={pageSize}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        companies={companiesData?.companies ?? []}
        onExportAll={async () => {
          const response = await OrdersService.getAllOrderExport<{ orders: any[] }>(
            resolvedModel,
            {
              ...(effectiveCategory ? { category: effectiveCategory } : {}),
              ...(resolvedClientType ? { client_type: resolvedClientType } : {}),
            } as any,
          );
          return response.orders;
        }}
      />
    </div>
  );
}
