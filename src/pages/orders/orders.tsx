import { Typography } from "antd";

import {
  entityPage,
  getOrderCategoryLabelByModel,
  getOrderColumnsByModel,
  resolveOrderModel,
  resolveOrderCategory,
  resolvePartnerCategory,
  useListEntity,
} from "./config-page.const";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";
import { FormModal as TelecomFormModal } from "./telecom/components/form-modal";
import { ViewModal as TelecomViewModal } from "./telecom/components/view-modal";
import { FormModal as FinanceFormModal } from "./finances/components/form-modal";
import { ViewModal as FinanceViewModal } from "./finances/components/view-modal";

const orderSegmentComponents = {
  finances: {
    FormModal: FinanceFormModal,
    ViewModal: FinanceViewModal,
  },
  telecom: {
    FormModal: TelecomFormModal,
    ViewModal: TelecomViewModal,
  },
} as const;

interface OrdersPageProps {
  model?: string;
  category?: string;
}

export function OrdersPage({ model, category }: OrdersPageProps) {
  const resolvedModel = resolveOrderModel(model);
  const isFinanceModel = resolvedModel === "finances";
  const resolvedCategory = isFinanceModel ? undefined : resolveOrderCategory(category, resolvedModel);
  const { resolvedPartnerId } = useResolvedOrderScope(resolvedModel);
  const { data: companiesData } = useCompanyQuery();
  const { data: partnersData } = usePartnerQuery({
    partnerId: resolvedPartnerId,
    enabled: resolvedPartnerId != null,
  });

  const partnerCategories = partnersData?.partners?.[0]?.category ?? [];
  const effectiveCategory = isFinanceModel
    ? undefined
    : resolvePartnerCategory(
      resolvedCategory,
      partnerCategories,
      resolvedModel,
    );
  const columns = getOrderColumnsByModel(resolvedModel, companiesData?.companies ?? []);
  const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } =
    orderSegmentComponents[resolvedModel === "finances" ? "finances" : "telecom"];

  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: effectiveCategory ? { category: effectiveCategory } : undefined,
  });

  const titleLabel = isFinanceModel
    ? "Financeiro"
    : getOrderCategoryLabelByModel(effectiveCategory ?? "", resolvedModel);

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
