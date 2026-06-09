import type { UserRole } from "@/types/IUser.type";

export const roleLabelMap: Record<UserRole, string> = {
  ADMIN: "Admin",
  GESTOR: "Gestor",
  DIRETOR: "Diretor",
  GERENTE: "Gerente",
  LIDER: "Líder",
  CONSULTOR: "Consultor",
};

export function formatRoleLabel(value: string): string {
  if (!value.trim()) return value;

  const normalizedValue = value.toUpperCase() as UserRole;
  return roleLabelMap[normalizedValue] ?? value;
}
