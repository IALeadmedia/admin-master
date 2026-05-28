import { useLocation } from "@tanstack/react-router";

import { resolveOrderClientType } from "@/pages/orders/config-page.const";
import { OrdersPage } from "@/pages/orders/orders";
import { Route } from "./$model.$category";

export function OrderModelCategoryComponent() {
    const { model, category } = Route.useParams();
    const { pathname } = useLocation();

    // Extract optional clientType from the URL path last segment.
    // /app/order/telecom/banda-larga/pf -> clientType = "pf"
    // /app/order/telecom/telefonia-movel -> clientType = undefined
    const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? "";
    const clientType = resolveOrderClientType(lastSegment) ? lastSegment : undefined;

    return (
        <OrdersPage
            key={clientType ?? "default"}
            model={model}
            category={category}
            clientType={clientType}
        />
    );
}