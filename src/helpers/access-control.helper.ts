import { LocalStorageKeys } from "@/enums/LocalStorageKeys.enum";
import type { IAuthPayload } from "@/types/IAuthPayload.type";
import type { UserRole } from "@/types/IUser.type";

export type PermissionResource =
  | "companies"
  | "partners"
  | "users"
  | "priorities"
  | "products"
  | "orders";
export type PermissionAction = "view" | "create" | "edit" | "delete";

type RestrictedRoute =
  | "/app/companies"
  | "/app/partners"
  | "/app/users"
  | "/app/priorities"
  | "/app/products"
  | "/app/orders";

const allCrudActions: PermissionAction[] = ["view", "create", "edit", "delete"];

const permissionsByRole: Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
> = {
  ADMIN: {
    companies: allCrudActions,
    partners: allCrudActions,
    users: allCrudActions,
    products: allCrudActions,
    priorities: allCrudActions,
    orders: allCrudActions,
  },
  GESTOR: {
    users: allCrudActions,
    products: allCrudActions,
    orders: allCrudActions,
  },
  DIRETOR: { products: allCrudActions, orders: ["view", "edit"] },
  GERENTE: { products: ["view"], orders: ["view", "edit"] },
  LIDER: { products: ["view"], orders: ["view", "edit"] },
  CONSULTOR: { products: ["view"], orders: ["view", "edit"] },
};

const routeResourceMap: Record<RestrictedRoute, PermissionResource> = {
  "/app/companies": "companies",
  "/app/partners": "partners",
  "/app/users": "users",
  "/app/priorities": "priorities",
  "/app/products": "products",
  "/app/orders": "orders",
};

export function getStoredUserRole(): UserRole | null {
  try {
    const storedUser = localStorage.getItem(LocalStorageKeys.user);
    if (!storedUser) return null;

    const payload = JSON.parse(storedUser) as IAuthPayload;
    return payload?.user?.role ?? null;
  } catch {
    return null;
  }
}

export function can(
  role: UserRole | null | undefined,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  if (!role) return false;

  const allowedActions = permissionsByRole[role][resource] ?? [];
  return allowedActions.includes(action);
}

export function canAccessRoute(
  role: UserRole | null | undefined,
  path?: string,
): boolean {
  if (!path) return true;

  const resource = routeResourceMap[path as RestrictedRoute];
  if (!resource) return true;

  return can(role, resource, "view");
}

export function isGlobalAdminUser(
  userPayload: IAuthPayload | null | undefined,
) {
  return userPayload?.user?.role === "ADMIN";
}

// Empresas
// view/create/edit/delete: só Admin.
// Parceiros
// view/create/edit/delete: só Admin.
// Usuários
// view/create/edit/delete: Admin e Gestor.
// Pedidos
// view: todos (com filtro por hierarquia).
// edit: todos.
// delete: Gerente ou acima.
// Produtos
// view: todos.
// create/edit/delete: Gerente ou acima.
// Clientes
// view/create/edit: todos.
// delete: Gerente ou acima.
// Mensagens
// view: todos.
// delete: Gerente ou acima.
// Tools
// uso: todos.
// Book de ofertas
// pendente de detalhamento.
// BackOffice
// pendente de detalhamento.
