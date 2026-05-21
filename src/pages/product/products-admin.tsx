import { Card, Typography } from "antd";
import { useState } from "react";
import type { ComponentType } from "react";
import { useAdminScope } from "@/context/admin-scope-provider";
import * as telecomConfig from "./telecom/config-page.const";
import * as financiesConfig from "./financies/config-page.const";
import { TableMain as TelecomTable } from "./telecom/components/table";
import { TableMain as FinanciesTable } from "./financies/components/table";

type ProductModel = "telecom" | "finances";

const categoryOptions: Record<ProductModel, Array<{ label: string; value: string }>> = {
    telecom: [
        { label: "Banda Larga", value: "banda-larga" },
        { label: "Telefonia Móvel", value: "telefonia-movel" },
    ],
    finances: [
        { label: "Maquininha", value: "maquininha" },
        { label: "Empréstimo", value: "emprestimo" },
    ],
};

const defaultCategoryByModel: Record<ProductModel, string> = {
    telecom: telecomConfig.TELECOM_DEFAULT_CATEGORY,
    finances: financiesConfig.FINANCIES_DEFAULT_CATEGORY,
};

type CategorySelect = {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (v: string) => void;
};

type ProductPanelProps = {
    category: string;
    categorySelect: CategorySelect;
};

function TelecomPanel({ category, categorySelect }: ProductPanelProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data, isLoading } = telecomConfig.useListEntity(category, currentPage, pageSize);
    return (
        <TelecomTable
            data={data?.products ?? []}
            isLoading={isLoading}
            category={category}
            model="telecom"
            currentPage={currentPage}
            pageSize={pageSize}
            total={data?.total ?? 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            categorySelect={categorySelect}
        />
    );
}

function FinanciesPanel({ category, categorySelect }: ProductPanelProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data, isLoading } = financiesConfig.useListEntity(category, currentPage, pageSize);
    return (
        <FinanciesTable
            data={data?.products ?? []}
            isLoading={isLoading}
            category={category}
            model="finances"
            currentPage={currentPage}
            pageSize={pageSize}
            total={data?.total ?? 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            categorySelect={categorySelect}
        />
    );
}

const panelByModel: Record<ProductModel, ComponentType<ProductPanelProps>> = {
    telecom: TelecomPanel,
    finances: FinanciesPanel,
};

function ProductModelPanels({ resolvedModel }: { resolvedModel: ProductModel }) {
    const [selectedCategory, setSelectedCategory] = useState<string>(
        defaultCategoryByModel[resolvedModel],
    );

    const ActivePanel = panelByModel[resolvedModel];
    const categorySelect: CategorySelect = {
        options: categoryOptions[resolvedModel],
        value: selectedCategory,
        onChange: setSelectedCategory,
    };

    return (
        <ActivePanel
            key={`${resolvedModel}-${selectedCategory}`}
            category={selectedCategory}
            categorySelect={categorySelect}
        />
    );
}

export function ProductsAdminPage() {
    const { selectedSegmentId } = useAdminScope();

    const resolvedModel: ProductModel =
        selectedSegmentId === "telecom" || selectedSegmentId === "finances"
            ? selectedSegmentId
            : "telecom";

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                Produtos
            </Typography.Title>

            {!selectedSegmentId ? (
                <Card style={{ marginBottom: 16 }}>
                    <Typography.Paragraph>
                        Selecione um modelo/segmento usando o seletor "Modelo/Segmento" no topo da página.
                    </Typography.Paragraph>
                </Card>
            ) : (
                <ProductModelPanels key={resolvedModel} resolvedModel={resolvedModel} />
            )}
        </div>
    );
}
