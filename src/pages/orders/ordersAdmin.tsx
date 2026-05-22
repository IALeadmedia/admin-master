import { useMemo, useState, useEffect } from "react";
import { Card, Typography } from "antd";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";

import {
    entityPage,
    getOrderCategoryLabelByModel,
    getOrderColumnsByModel,
    resolveOrderModel,
    segmentComponents,
    segmentRegistry,
    useListEntity,
} from "./config-page.const";
import { useOrderCategoryFilter } from "./useOrderCategoryFilter";

export function OrdersAdminPage() {
    const { selectedSegmentId, selectedCompanyId, selectedPartnerId } = useAdminScope();

    const hasScope = !!selectedSegmentId && !!selectedCompanyId;
    const model = resolveOrderModel(selectedSegmentId);
    const { hasCategories } = segmentRegistry[model];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data: companiesData } = useCompanyQuery({ enabled: !!selectedSegmentId });
    const { data: partnersData } = usePartnerQuery({
        segmentId: selectedSegmentId,
        partnerId: selectedPartnerId,
        enabled: !!selectedSegmentId,
    });

    const partnerCategories = useMemo(() => {
        if (!hasCategories) return [];

        if (selectedPartnerId != null) {
            return partnersData?.partners?.[0]?.category ?? [];
        }

        return Array.from(
            new Set(
                (partnersData?.partners ?? []).flatMap((partner) => partner.category ?? []),
            ),
        );
    }, [hasCategories, partnersData?.partners, selectedPartnerId]);

    // Category filter state derived from partner categories (server-side filtering)
    const { categorySelect, effectiveCategory } = useOrderCategoryFilter({
        model,
        orders: [],
        partnerCategories,
    });

    // Reset to page 1 when model or category changes
    useEffect(() => {
        setPage(1);
    }, [model, effectiveCategory]);

    const { data, isLoading } = useListEntity({
        model,
        filters: effectiveCategory ? { category: effectiveCategory } : undefined,
        page,
        per_page: pageSize,
        enabled: hasScope,
    });

    const orders = useMemo(() => data?.orders ?? [], [data?.orders]);
    const total = data?.total ?? 0;

    const columns = getOrderColumnsByModel(model, companiesData?.companies ?? []);
    const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } = segmentComponents[model];

    const pageTitle = !hasScope
        ? "Pedidos"
        : hasCategories
            ? `${entityPage.plural} - ${getOrderCategoryLabelByModel(effectiveCategory ?? "", model)}`
            : `${entityPage.plural}`;

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {pageTitle}
            </Typography.Title>

            {!hasScope ? (
                <Card style={{ marginBottom: 16 }}>
                    <Typography.Paragraph>
                        Selecione um segmento usando o seletor "Segmento" no topo da página.
                    </Typography.Paragraph>
                </Card>
            ) : (
                <CommonTableMain
                    data={orders}
                    isLoading={isLoading}
                    columns={columns}
                    categorySelect={categorySelect}
                    FormModalComponent={FormModalComponent}
                    ViewModalComponent={ViewModalComponent}
                    currentPage={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                />
            )}
        </div>
    );
}


