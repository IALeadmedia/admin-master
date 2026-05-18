import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { appSetting } from "../constants/app-setting/config.const";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
  head: () => ({
    meta: [{ title: `${appSetting.name}` }],
  }),
});

// eslint-disable-next-line react-refresh/only-export-components
function IndexRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/app", replace: true });
  }, [navigate]);

  return null;
}
