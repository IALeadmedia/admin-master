import { createFileRoute, redirect } from "@tanstack/react-router";
import { PartnersPage } from "@/pages/partners/partners";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";

export const Route = createFileRoute("/app/partners")({
  component: PartnersPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "partners", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
