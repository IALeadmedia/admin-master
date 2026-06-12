import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import Evolution from "@/chat-uberich/pages/evolution/evolution";

export const Route = createFileRoute("/app/evolution")({
  component: Evolution,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "evolution", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
