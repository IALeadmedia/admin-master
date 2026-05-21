import { useMemo, useState } from "react";
import { Card, Typography } from "antd";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";
import { FormModal as TelecomFormModal } from "./telecom/components/form-modal";
import { ViewModal as TelecomViewModal } from "./telecom/components/view-modal";
import { FormModal as FinanceFormModal } from "./finances/components/form-modal";
import { ViewModal as FinanceViewModal } from "./finances/components/view-modal";

import {
    defaultCategoryByModel,
    entityPage,
    getOrderCategoryLabelByModel,
    getOrderColumnsByModel,
    getPartnerCategoryOptions,
    resolveOrderModel,
    resolvePartnerCategory,
    useListEntity,
} from "./config-page.const";

export function OrdersAdminPage() {
    const { selectedSegmentId, selectedPartnerId } = useAdminScope();
    const { data, isLoading } = useListEntity();
    const orders = useMemo(() => data?.orders ?? [], [data?.orders]);
    const model = resolveOrderModel(selectedSegmentId);
    const { data: companiesData } = useCompanyQuery({ enabled: !!selectedSegmentId });
    const { data: partnersData } = usePartnerQuery({
        segmentId: selectedSegmentId,
        partnerId: selectedPartnerId,
        enabled: !!selectedSegmentId,
    });

    const partnerCategories = useMemo(() => {
        if (selectedPartnerId != null) {
            return partnersData?.partners?.[0]?.category ?? [];
        }

        return Array.from(
            new Set(
                (partnersData?.partners ?? []).flatMap((partner) => partner.category ?? []),
            ),
        );
    }, [partnersData?.partners, selectedPartnerId]);

    const categoryOptions = useMemo(() => {
        const categories = partnerCategories.length
            ? partnerCategories
            : Array.from(
                new Set(orders.map((order) => order.category).filter(Boolean)),
            ) as string[];

        const options = getPartnerCategoryOptions(categories, model);
        const source = options.length
            ? options
            : [{
                label: getOrderCategoryLabelByModel(defaultCategoryByModel[model], model),
                value: defaultCategoryByModel[model],
            }];

        return source;
    }, [model, orders, partnerCategories]);

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

    const resolvedSelectedCategory = useMemo(() => {
        if (!categoryOptions.length) return undefined;

        const hasSelected =
            selectedCategory &&
            categoryOptions.some((option) => option.value === selectedCategory);

        return hasSelected ? selectedCategory : categoryOptions[0].value;
    }, [categoryOptions, selectedCategory]);

    const filteredOrders = useMemo(() => {
        const hasCategoryData = orders.some((order) => Boolean(order.category));

        if (!resolvedSelectedCategory || !hasCategoryData) return orders;
        return orders.filter((order) => order.category === resolvedSelectedCategory);
    }, [orders, resolvedSelectedCategory]);

    const effectiveCategory = useMemo(
        () =>
            resolvePartnerCategory(
                resolvedSelectedCategory,
                partnerCategories,
                model,
            ),
        [model, partnerCategories, resolvedSelectedCategory],
    );
    const columns = getOrderColumnsByModel(model, companiesData?.companies ?? []);
    const FormModalComponent = model === "finances" ? FinanceFormModal : TelecomFormModal;
    const ViewModalComponent = model === "finances" ? FinanceViewModal : TelecomViewModal;

    const categorySelect = {
        options: categoryOptions,
        value: effectiveCategory,
        onChange: setSelectedCategory,
    };

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {entityPage.plural} - {getOrderCategoryLabelByModel(effectiveCategory, model)}
            </Typography.Title>

            {!selectedSegmentId ? (
                <Card style={{ marginBottom: 16 }}>
                    <Typography.Paragraph>
                        Selecione um modelo/segmento usando o seletor "Modelo/Segmento" no topo da página.
                    </Typography.Paragraph>
                </Card>
            ) : (
                <CommonTableMain
                    data={filteredOrders}
                    isLoading={isLoading}
                    columns={columns}
                    categorySelect={categorySelect}
                    FormModalComponent={FormModalComponent}
                    ViewModalComponent={ViewModalComponent}
                />
            )}
        </div>
    );
}
