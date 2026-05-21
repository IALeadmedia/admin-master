import { Typography } from "antd";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { configByModel, resolveProductModel } from "./config-page.const";

function ProductsTableSection({
    model,
    category,
}: {
    model: "telecom" | "finances";
    category: string;
}) {
    const config = configByModel[model];
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data, isLoading } = config.useListEntity(category, currentPage, pageSize);
    const TableComponent = config.TableComponent;

    return (
        <TableComponent
            data={data?.products ?? []}
            isLoading={isLoading}
            category={category}
            model={model}
            currentPage={currentPage}
            pageSize={pageSize}
            total={data?.total ?? 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
        />
    );
}

export function ProductsPage() {
    const { model: rawModel, category } = useParams({ from: "/app/products/$model/$category" });

    const model = resolveProductModel(rawModel);
    const config = configByModel[model];
    const categoryLabel = config.getCategoryLabel(category);

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {config.entityPage.plural} - {categoryLabel}
            </Typography.Title>
            <ProductsTableSection key={`${model}-${category}`} model={model} category={category} />
        </div>
    );
}