import { useMemo, useState, useEffect, useRef, startTransition } from "react";
import { Card, Typography, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useAllSegmentOrdersQuery } from "@/hooks/orders/useAllSegmentOrdersQuery";
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

    // Segmento selecionado sem empresa → rota "all segment" (GET /{module}/orders)
    const hasSegmentOnly = !!selectedSegmentId && !selectedCompanyId;
    // Segmento + empresa selecionados → rota normal com operadora
    const hasScope = !!selectedSegmentId && !!selectedCompanyId;

    const model = resolveOrderModel(selectedSegmentId);
    const { hasCategories } = segmentRegistry[model];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
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

    const clientTypeSelect = isBandaLarga
        ? {
            options: [
                { label: "PF e PJ", value: "" },
                { label: "Pessoa Física (PF)", value: "PF" },
                { label: "Pessoa Jurídica (PJ)", value: "PJ" },
            ],
            value: clientType,
            onChange: (v: string) => { setClientType(v as "PF" | "PJ" | ""); setPage(1); },
        }
        : undefined;

    // Colunas exclusivas do admin: Empresa e Parceiro no início da tabela
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminPrefixColumns: TableColumnsType<any> = [
        {
            title: "Empresa",
            dataIndex: "company_id",
            width: 110,
            ellipsis: { showTitle: false },
            render: (company_id: number | null) => {
                if (!company_id) return "-";
                const name = companiesData?.companies.find(c => c.company_id === company_id)?.company_name;
                return (
                    <Tooltip placement="topLeft" title={name ?? `#${company_id}`} overlayInnerStyle={{ fontSize: 12 }}>
                        {name ?? `#${company_id}`}
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
        ...(getOrderColumnsByModel(model, companiesData?.companies ?? []) ?? []),
    ];
    const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } = segmentComponents[model];

    const pageTitle = !selectedSegmentId
        ? "Pedidos"
        : hasCategories
            ? `${entityPage.plural} - ${getOrderCategoryLabelByModel(effectiveCategory ?? "", model)}`
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
                />
            )}
        </div>
    );
}


