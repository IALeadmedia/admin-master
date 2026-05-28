import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";

export const Route = createFileRoute("/app/products")({
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "products", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});

// protege a rota base da tela products, verifica permissão do usuario
// se não tiver permissão redireciona pra app
