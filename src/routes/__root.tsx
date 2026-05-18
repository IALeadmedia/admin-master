import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { GeneralError } from "../pages/errors/general-error";
import { NotFoundError } from "../pages/errors/not-found-error";
import { Toaster } from "sonner";
import type { JSX } from "react";
import { useTheme } from "@/context/theme-provider";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});

// eslint-disable-next-line react-refresh/only-export-components
function RootComponent(): JSX.Element {
  const { isDarkMode } = useTheme();
  return (
    <>
      <HeadContent />
      <Outlet />

      <Toaster
        theme={isDarkMode ? "dark" : "light"}
        icons={{
          success: <CheckCircleOutlined className="size-4" />,
          info: <InfoCircleOutlined className="size-4" />,
          warning: <ExclamationCircleOutlined className="size-4" />,
          error: <CloseCircleOutlined className="size-4" />,
          loading: <LoadingOutlined className="size-4 animate-spin" />,
        }}
      />
    </>
  );
}
