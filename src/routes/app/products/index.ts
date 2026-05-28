import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { ProductsAdminPage } from "@/pages/product/products-admin";
import {
  defaultProductModel,
  defaultCategoryByModel,
} from "@/pages/product/config-page.const";

export const Route = createFileRoute("/app/products/")({
  component: ProductsAdminPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "products", "view")) {
      throw redirect({ to: "/app" });
    }

    if (!isAdminDomain) {
      throw redirect({
        to: "/app/products/$model/$category",
        params: {
          model: defaultProductModel,
          category: defaultCategoryByModel[defaultProductModel],
        },
      });
    }
  },
});

// protege a rota com /.. e faz a tela inicial de products
// também checa permissão do usuario
// direciona para onde ir: versão admin ou ususario regular
