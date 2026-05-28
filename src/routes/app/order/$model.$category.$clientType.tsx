import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import {
    resolveOrderCategory,
    resolveOrderClientType,
    resolveOrderModel,
} from "@/pages/orders/config-page.const";
import { OrderModelCategoryClientTypeComponent } from "./$model.$category.$clientType.component";

export const Route = createFileRoute("/app/order/$model/$category/$clientType")({
    component: OrderModelCategoryClientTypeComponent,
    beforeLoad: ({ params }) => {
        if (!can(getStoredUserRole(), "orders", "view")) {
            throw redirect({ to: "/app" });
        }

        if (isAdminDomain) {
            throw redirect({ to: "/app/order" });
        }

        const model = resolveOrderModel(params.model);
        const category = resolveOrderCategory(params.category, model);

        // Only telecom/banda-larga supports client_type sub-routes
        if (model !== "telecom" || category !== "banda-larga") {
            throw redirect({
                to: "/app/order/$model/$category",
                params: { model, category },
            });
        }

        // Normalize clientType to lowercase url param (pf/pj), default pf
        const resolvedUpper = resolveOrderClientType(params.clientType);
        const clientType = resolvedUpper ? resolvedUpper.toLowerCase() : "pf";

        if (
            model !== params.model ||
            category !== params.category ||
            clientType !== params.clientType
        ) {
            throw redirect({
                to: "/app/order/$model/$category/$clientType",
                params: { model, category, clientType },
            });
        }
    },
});