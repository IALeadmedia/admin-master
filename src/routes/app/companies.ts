import { CompaniesPage } from "@/pages/companies/companies";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/companies")({
  component: CompaniesPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "companies", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
