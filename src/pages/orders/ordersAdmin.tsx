import { useMemo, useState, useEffect, useRef, startTransition } from "react";
import { Card, Typography, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useAllSegmentOrdersQuery } from "@/hooks/orders/useAllSegmentOrdersQuery";
import { TableMain as CommonTableMain } from "./common/components/table";
import { OrdersService } from "@/services/orders.service";

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
import { getAvailabilityExportColumns } from "./telecom/components/columns";

export function OrdersAdminPage() {
    const { selectedSegmentId, selectedCompanyId, selectedPartnerId } = useAdminScope();

    // Segmento selecionado sem empresa → rota "all segment" (GET /{module}/orders)
    const hasSegmentOnly = !!selectedSegmentId && !selectedCompanyId;
    // Segmento + empresa selecionados → rota normal com operadora
    const hasScope = !!selectedSegmentId && !!selectedCompanyId;

    const model = resolveOrderModel(selectedSegmentId);
    const { hasCategories } = segmentRegistry[model];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [clientType, setClientType] = useState<"PF" | "PJ" | "">("");

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
        includeAllOption: true,
    });

    const isBandaLarga = model === "telecom" && effectiveCategory === "banda-larga";

    const prevFiltersRef = useRef({ model, effectiveCategory });

    // Reset clientType e page quando model ou category mudam (sem setState síncrono no effect)
    useEffect(() => {
        const prev = prevFiltersRef.current;
        if (prev.model !== model || prev.effectiveCategory !== effectiveCategory) {
            prevFiltersRef.current = { model, effectiveCategory };
            startTransition(() => {
                setPage(1);
                if (!isBandaLarga) setClientType("");
            });
        }
    }, [model, effectiveCategory, isBandaLarga]);

    const sharedFilters = {
        ...(effectiveCategory ? { category: effectiveCategory } : {}),
        ...(clientType ? { client_type: clientType } : {}),
    };

    // Rota "all segment": GET /{module}/orders — apenas quando segmento selecionado sem empresa
    const { data: segmentData, isLoading: segmentLoading } = useAllSegmentOrdersQuery({
        module: model,
        filters: sharedFilters,
        page,
        per_page: pageSize,
        enabled: hasSegmentOnly,
    });

    // Rota normal com operadora: GET /{module}/{operator}/orders — quando empresa selecionada
    const { data: scopeData, isLoading: scopeLoading } = useListEntity({
        model,
        filters: sharedFilters,
        page,
        per_page: pageSize,
        enabled: hasScope,
    });

    const data = hasSegmentOnly ? segmentData : scopeData;
    const isLoading = hasSegmentOnly ? segmentLoading : scopeLoading;

    const orders = useMemo(() => data?.orders ?? [], [data?.orders]);
    const total = data?.total ?? 0;

    const clientTypeSelect =
    {
        options: [
            { label: "PF e PJ", value: "" },
            { label: "Pessoa Física (PF)", value: "PF" },
            { label: "Pessoa Jurídica (PJ)", value: "PJ" },
        ],
        value: clientType,
        onChange: (v: string) => { setClientType(v as "PF" | "PJ" | ""); setPage(1); },
    }

    const adminPrefixColumns: TableColumnsType<any> = [
        {
            title: "Empresa",
            dataIndex: "company_id",
            width: 110,
            ellipsis: { showTitle: false },
            render: (company_id: number | null, record) => {
                // Tenta resolver pelo company_id primeiro, depois cai no campo company
                const name = company_id
                    ? (companiesData?.companies.find(c => c.company_id === company_id)?.company_name ?? record.company)
                    : record.company;

                if (!name) return "-";

                return (
                    <Tooltip placement="topLeft" title={name} overlayInnerStyle={{ fontSize: 12 }}>
                        {name}
                    </Tooltip>
                );
            },
        },
        {
            title: "Parceiro",
            dataIndex: "partner_id",
            width: 110,
            ellipsis: { showTitle: false },
            render: (partner_id: number | null) => {
                if (!partner_id) return "-";
                const name = partnersData?.partners?.find(p => p.partner_id === partner_id)?.partner_name;
                return (
                    <Tooltip placement="topLeft" title={name ?? `#${partner_id}`} overlayInnerStyle={{ fontSize: 12 }}>
                        {name ?? `#${partner_id}`}
                    </Tooltip>
                );
            },
        },
    ];

    const columns = [
        ...adminPrefixColumns,
        ...(getOrderColumnsByModel(model, companiesData?.companies ?? [], true) ?? []),
    ];
    const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } = segmentComponents[model];

    const availabilityExportColumns = useMemo(
        () => model === "telecom" ? getAvailabilityExportColumns(companiesData?.companies ?? []) : [],
        [model, companiesData?.companies],
    );

    const adminExportColumns = useMemo(() => [
        {
            title: "Empresa",
            getValue: (record: unknown) => {
                const r = record as { company_id?: number | null; company?: string | null };
                const name = r.company_id
                    ? (companiesData?.companies.find(c => c.company_id === r.company_id)?.company_name ?? r.company)
                    : r.company;
                return name ?? "-";
            },
        },
        {
            title: "Parceiro",
            getValue: (record: unknown) => {
                const r = record as { partner_id?: number | null };
                if (!r.partner_id) return "-";
                return partnersData?.partners?.find(p => p.partner_id === r.partner_id)?.partner_name ?? `#${r.partner_id}`;
            },
        },
        ...availabilityExportColumns,
    ], [companiesData?.companies, partnersData?.partners, availabilityExportColumns]);

    const pageTitle = !selectedSegmentId
        ? "Pedidos"
        : hasCategories
            ? effectiveCategory
                ? `${entityPage.plural} - ${getOrderCategoryLabelByModel(effectiveCategory, model)}`
                : entityPage.plural
            : `${entityPage.plural}`;

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {pageTitle}
            </Typography.Title>

            {!selectedSegmentId ? (
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
                    clientTypeSelect={clientTypeSelect}
                    FormModalComponent={FormModalComponent}
                    ViewModalComponent={ViewModalComponent}
                    currentPage={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    companies={companiesData?.companies ?? []}
                    exportExtraColumns={adminExportColumns}
                    exportExcludeDataIndexes={["company_id", "partner_id"]}
                    onExportAll={async () => {
                        const exportFilters = {
                            ...sharedFilters,
                            ...(selectedCompanyId != null ? { company_id: selectedCompanyId } : {}),
                            ...(selectedPartnerId != null ? { partner_id: selectedPartnerId } : {}),
                        };
                        const response = await OrdersService.getAllOrderExport<{ orders: any[] }>(
                            model,
                            exportFilters as any,
                        );
                        return response.orders;
                    }}
                />
            )}
        </div>
    );
}


