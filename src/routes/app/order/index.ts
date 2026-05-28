import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import {
  defaultCategoryByModel,
  defaultOrderModel,
} from "@/pages/orders/config-page.const";
import { OrdersAdminPage } from "@/pages/orders/ordersAdmin";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/order/")({
  component: isAdminDomain ? OrdersAdminPage : Outlet,
  beforeLoad: ({ location }) => {
    if (!can(getStoredUserRole(), "orders", "view")) {
      throw redirect({ to: "/app" });
    }

    if (!isAdminDomain && location.pathname === "/app/order") {
      throw redirect({
        to: "/app/order/$model/$category",
        params: {
          model: defaultOrderModel,
          category: defaultCategoryByModel[defaultOrderModel],
        },
      });
    }
  },
});
