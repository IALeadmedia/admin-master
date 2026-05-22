import { Route } from "./order.$model.$category.$clientType";

import { OrdersPage } from "@/pages/orders/orders";

export function OrderModelCategoryClientTypeComponent() {
    const { model, category, clientType } = Route.useParams();

    return (
        <OrdersPage
            key={clientType}
            model={model}
            category={category}
            clientType={clientType}
        />
    );
}