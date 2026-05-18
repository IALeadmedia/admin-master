import { Typography } from "antd";
import { useParams } from "@tanstack/react-router";
import { configByModel, isKnownProductModel, defaultProductModel } from "./config-page.const";

export function ProductsPage() {
    const { model: rawModel, category } = useParams({ from: "/app/products/$model/$category" });

    const model = isKnownProductModel(rawModel) ? rawModel : defaultProductModel;
    const config = configByModel[model];
    const { data, isLoading } = config.useListEntity(category);
    const categoryLabel = config.getCategoryLabel(category);
    const TableComponent = config.TableComponent;

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {config.entityPage.plural} - {categoryLabel}
            </Typography.Title>
            <TableComponent
                data={data?.products ?? []}
                isLoading={isLoading}
                category={category}
                model={model}
            />
        </div>
    );
}