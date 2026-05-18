import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { OrdersPage } from "@/pages/orders/orders";
import { resolveOrderCategory } from "@/pages/orders/config-page.const";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/order/$category")({
    component: OrdersByCategoryRoute,
    beforeLoad: ({ params }) => {
        if (!can(getStoredUserRole(), "orders", "view")) {
            throw redirect({ to: "/app" });
        }

        if (isAdminDomain) {
            throw redirect({ to: "/app/order" });
        }

        const category = resolveOrderCategory(params.category);
        if (category !== params.category) {
            throw redirect({
                to: "/app/order/$category",
                params: { category },
            });
        }
    },
});

function OrdersByCategoryRoute() {
    const { category } = Route.useParams();
    return <OrdersPage category={category} />;
}
