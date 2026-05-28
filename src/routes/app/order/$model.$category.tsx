import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import {
    resolveOrderCategory,
    resolveOrderModel,
} from "@/pages/orders/config-page.const";
import { OrderModelCategoryComponent } from "./$model.$category.component";

export const Route = createFileRoute("/app/order/$model/$category")({
    component: OrderModelCategoryComponent,
    beforeLoad: ({ params }) => {
        if (!can(getStoredUserRole(), "orders", "view")) {
            throw redirect({ to: "/app" });
        }

        if (isAdminDomain) {
            throw redirect({ to: "/app/order" });
        }

        const model = resolveOrderModel(params.model);
        if (model === "finances" || model === "benefits") {
            throw redirect({ to: "/app/order/$model", params: { model } });
        }

        const category = resolveOrderCategory(params.category, model);

        if (model !== params.model || category !== params.category) {
            throw redirect({
                to: "/app/order/$model/$category",
                params: { model, category },
            });
        }
    },
});