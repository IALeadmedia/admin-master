import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import {
  defaultCategoryByModel,
  resolveOrderModel,
} from "@/pages/orders/config-page.const";
import { OrderModelComponent } from "../$model.component";

export const Route = createFileRoute("/app/order/$model/")({
  component: OrderModelComponent,
  beforeLoad: ({ params, location }) => {
    if (!can(getStoredUserRole(), "orders", "view")) {
      throw redirect({ to: "/app" });
    }

    if (isAdminDomain) {
      throw redirect({ to: "/app/order" });
    }

    const model = resolveOrderModel(params.model);

    if (model === "finances" || model === "benefits") {
      return;
    }

    // Avoid redirect loops when this parent route is matched together with
    // /app/order/$model/$category.
    const isModelOnlyPath = location.pathname === `/app/order/${params.model}`;
    if (!isModelOnlyPath && model === params.model) {
      return;
    }

    throw redirect({
      to: "/app/order/$model/$category",
      params: { model, category: defaultCategoryByModel[model] },
    });
  },
});
