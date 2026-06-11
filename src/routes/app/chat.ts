import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Chats } from "@/chat-uberich/pages/chats/chats";

export const Route = createFileRoute("/app/chat")({
  component: Chats,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "chat", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
