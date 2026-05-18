import { createFileRoute, redirect } from "@tanstack/react-router";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { PrioritiesPage } from "@/pages/priorities/priorities";

export const Route = createFileRoute("/app/priorities")({
  component: PrioritiesPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "priorities", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
