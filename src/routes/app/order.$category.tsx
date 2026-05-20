import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { resolveOrderCategory } from "@/pages/orders/config-page.const";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/order/$category")({
    beforeLoad: ({ params }) => {
        if (!can(getStoredUserRole(), "orders", "view")) {
            throw redirect({ to: "/app" });
        }

        if (isAdminDomain) {
            throw redirect({ to: "/app/order" });
        }

        const category = resolveOrderCategory(params.category);
        throw redirect({
            to: "/app/order/$model/$category",
            params: { model: "telecom", category },
        });
    },
});
