import { useLocation } from "@tanstack/react-router";

import {
    resolveOrderCategory,
    resolveOrderClientType,
} from "@/pages/orders/config-page.const";
import { OrdersPage } from "@/pages/orders/orders";
import { Route } from "./$model";
import type { OrderModule } from "@/services/orders.service";

export function OrderModelComponent() {
    const { model } = Route.useParams() as { model: OrderModule };
    const { pathname } = useLocation();

    const segments = pathname.split("/").filter(Boolean);
    const category = resolveOrderCategory(segments[3], model);
    const clientType = resolveOrderClientType(segments.at(-1));

    return (
        <OrdersPage
            key={`${model}-${category}-${clientType ?? "default"}`}
            model={model}
            category={category}
            clientType={clientType}
        />
    );
}