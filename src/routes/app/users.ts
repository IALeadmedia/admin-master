import { UsersPage } from "@/pages/users/users";
import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/users")({
  component: UsersPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "users", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
