import { createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutMain } from "../../layout/layout-main/LayoutMain";
import { LocalStorageKeys } from "../../enums/LocalStorageKeys.enum";
import { NotFoundError } from "../../pages/errors/not-found-error";
import { z } from "zod";
const searchSchema = z.object({
  partner_hash: z.string().optional(),
});
export const Route = createFileRoute("/app")({
  component: LayoutMain,
  notFoundComponent: NotFoundError,
  validateSearch: searchSchema,
  beforeLoad: ({ location }) => {
    if (!localStorage.getItem(LocalStorageKeys.user))
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
  },
});
