import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { ProductsPage } from "@/pages/product/products";
import {
    defaultCategoryByModel,
    resolveProductModel,
} from "@/pages/product/config-page.const";

export const Route = createFileRoute("/app/products/$model/$category")({
    component: ProductsPage,
    beforeLoad: ({ params }) => {
        if (!can(getStoredUserRole(), "products", "view")) {
            throw redirect({ to: "/app" });
        }

        const resolvedModel = resolveProductModel(params.model);
        if (resolvedModel !== params.model) {
            throw redirect({
                to: "/app/products/$model/$category",
                params: {
                    model: resolvedModel,
                    category: defaultCategoryByModel[resolvedModel],
                },
            });
        }
    },
});
// rota da tela real, renderiza o productspage
// valida permissão e o corrige o modelo de vier invalido