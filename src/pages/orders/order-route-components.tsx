import { useParams } from "@tanstack/react-router";
import { OrdersPage } from "./orders";

export function OrderModelRoute() {
    const { model } = useParams({ from: "/app/order/$model" });

    return <OrdersPage model={model} />;
}

export function OrderModelCategoryRoute() {
    const { model, category } = useParams({ from: "/app/order/$model/$category" });

    return <OrdersPage model={model} category={category} />;
}