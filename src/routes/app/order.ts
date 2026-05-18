import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { OrdersPage } from "@/pages/orders/orders";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/order")({
  component: OrdersPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "orders", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
