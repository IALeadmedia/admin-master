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
import { useParams } from "@tanstack/react-router";
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
  const routeParams = useParams({
    from: "/app/order/$model/$category",
    shouldThrow: false,
  });

  const rawModel = model ?? routeParams?.model;
  const rawCategory = category ?? routeParams?.category;

  const resolvedModel = resolveOrderModel(rawModel);
  const resolvedCategory = resolveOrderCategory(rawCategory, resolvedModel);
  const { resolvedPartnerId } = useResolvedOrderScope(resolvedModel);
  const { data: companiesData } = useCompanyQuery();
  const { data: partnersData } = usePartnerQuery({
    partnerId: resolvedPartnerId,
    enabled: resolvedPartnerId != null,
  });

  const partnerCategories = partnersData?.partners?.[0]?.category ?? [];
  const effectiveCategory = resolvePartnerCategory(
    resolvedCategory,
    partnerCategories,
    resolvedModel,
  );
  const columns = getOrderColumnsByModel(resolvedModel, companiesData?.companies ?? []);
  const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } =
    orderSegmentComponents[resolvedModel === "finances" ? "finances" : "telecom"];

  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: { category: effectiveCategory },
  });

  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural} - {getOrderCategoryLabelByModel(effectiveCategory, resolvedModel)}
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
