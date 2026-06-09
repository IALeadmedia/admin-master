import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCreateUserMutation } from "@/hooks/users/useCreateUserMutation";
import { useDeleteUserMutation } from "@/hooks/users/useDeleteUserMutation";
import { useUpdateUserMutation } from "@/hooks/users/useUpdateUserMutation";
import { useUserQuery } from "@/hooks/users/useUserQuery";
import type { IUser, UserRole } from "@/types/IUser.type";

export const entityPage = dictionaryQueryClient.users;
export const useCreateEntity = useCreateUserMutation;
export const useUpdateEntity = useUpdateUserMutation;
export const useDeleteEntity = useDeleteUserMutation;
export const useListEntity = useUserQuery;
export type EntityType = IUser;

export type FormValues = {
  user_name: string;
  email: string;
  cpf: string;
  telephone: string;
  role: UserRole;
  password?: string;
  company_id?: number | null;
  partner_id?: number | null;
  allow_email_notifications?: boolean;
  allow_sms_notifications?: boolean;
  allow_wpp_notifications?: boolean;
  person_responsible_id?: number | null;
  consultant_hash?: string;
  user_type?: string;
  team?: string;
  cnpj?: string;
};

export const roleHierarchy: Record<string, number> = {
  ADMIN: 1,
  GESTOR: 2,
  DIRETOR: 3,
  GERENTE: 4,
  LIDER: 5,
  CONSULTOR: 6,
};

export const allRoleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Gestor", value: "GESTOR" },
  { label: "Diretor", value: "DIRETOR" },
  { label: "Gerente", value: "GERENTE" },
  { label: "Líder", value: "LIDER" },
  { label: "Consultor", value: "CONSULTOR" },
];

export const roleLabelMap: Record<string, string> = Object.fromEntries(
  allRoleOptions.map((option) => [option.value, option.label]),
);

export const subCredenciadoRoleOptions = allRoleOptions.filter(
  (option) => option.value === "LIDER" || option.value === "CONSULTOR",
);
