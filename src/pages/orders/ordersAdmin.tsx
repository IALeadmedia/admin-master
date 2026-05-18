import { useEffect, useMemo, useState } from "react";
import { Card, Typography } from "antd";
import { useAdminScope } from "@/context/admin-scope-provider";

import {
    defaultOrderCategory,
    entityPage,
    getOrderCategoryLabel,
    useListEntity,
} from "./config-page.const";
import { TableMain } from "./components/table";

function getCategoryLabel(category: string): string {
    if (category === "banda-larga" || category === "telefonia-movel") {
        return getOrderCategoryLabel(category);
    }

    return category;
}

export function OrdersAdminPage() {
    const { selectedSegmentId } = useAdminScope();
    const { data, isLoading } = useListEntity();
    const orders = data?.orders ?? [];

    const categoryOptions = useMemo(() => {
        const categories = Array.from(
            new Set(orders.map((order) => order.category).filter(Boolean)),
        ) as string[];

        const source = categories.length ? categories : [defaultOrderCategory];

        return source.map((category) => ({
            label: getCategoryLabel(category),
            value: category,
        }));
    }, [orders]);

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
        categoryOptions[0]?.value,
    );

    useEffect(() => {
        if (!categoryOptions.length) {
            setSelectedCategory(undefined);
            return;
        }

        const hasSelected =
            selectedCategory &&
            categoryOptions.some((option) => option.value === selectedCategory);

        if (!hasSelected) {
            setSelectedCategory(categoryOptions[0].value);
        }
    }, [categoryOptions, selectedCategory]);

    const filteredOrders = useMemo(() => {
        if (!selectedCategory) return orders;
        return orders.filter((order) => order.category === selectedCategory);
    }, [orders, selectedCategory]);

    const categorySelect = {
        options: categoryOptions,
        value: selectedCategory,
        onChange: setSelectedCategory,
    };

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {entityPage.plural}
            </Typography.Title>

            {!selectedSegmentId ? (
                <Card style={{ marginBottom: 16 }}>
                    <Typography.Paragraph>
                        Selecione um modelo/segmento usando o seletor "Modelo/Segmento" no topo da página.
                    </Typography.Paragraph>
                </Card>
            ) : (
                <TableMain
                    data={filteredOrders}
                    isLoading={isLoading}
                    categorySelect={categorySelect}
                />
            )}
        </div>
    );
}
