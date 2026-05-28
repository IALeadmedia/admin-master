import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  defaultCategoryByModel,
  resolveProductModel,
} from "@/pages/product/config-page.const";

export const Route = createFileRoute("/app/products/$model/")({
  beforeLoad: ({ params }) => {
    const model = resolveProductModel(params.model);

    throw redirect({
      to: "/app/products/$model/$category",
      params: { model, category: defaultCategoryByModel[model] },
    });
  },
});

// faz tratamento de url por categoria/segmento/modelo
