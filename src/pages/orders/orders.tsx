import { Typography } from "antd";

import {
  entityPage,
  getOrderCategoryLabelByModel,
  getOrderColumnsByModel,
  resolveOrderModel,
  resolveOrderCategory,
  resolvePartnerCategory,
  segmentComponents,
  segmentRegistry,
  useListEntity,
} from "./config-page.const";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";

interface OrdersPageProps {
  model?: string;
  category?: string;
}

export function OrdersPage({ model, category }: OrdersPageProps) {
  const resolvedModel = resolveOrderModel(model);
  const { hasCategories } = segmentRegistry[resolvedModel];
  const resolvedCategory = hasCategories ? resolveOrderCategory(category, resolvedModel) : undefined;
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

  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: effectiveCategory ? { category: effectiveCategory } : undefined,
  });

  const titleLabel = hasCategories
    ? getOrderCategoryLabelByModel(effectiveCategory ?? "", resolvedModel)
    : segmentRegistry[resolvedModel].label;

  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural} - {titleLabel}
      </Typography.Title>
      <CommonTableMain
        data={data?.orders || []}
        isLoading={isLoading}
        columns={columns}
        FormModalComponent={FormModalComponent}
        ViewModalComponent={ViewModalComponent}
      />
    </div>
  );
}
