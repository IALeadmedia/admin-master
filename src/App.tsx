import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { router } from "./lib/router";
import type { JSX } from "react";
import { AuthProvider } from "./context/auth-provider";
import ThemeProvider from "./context/theme-provider";
import { AdminScopeProvider } from "./context/admin-scope-provider";

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AdminScopeProvider>
            <RouterProvider router={router} />
          </AdminScopeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
