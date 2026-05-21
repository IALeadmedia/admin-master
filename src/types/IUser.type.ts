export type UserRole =
  | "ADMIN"
  | "GESTOR"
  | "DIRETOR"
  | "GERENTE"
  | "LIDER"
  | "CONSULTOR";

export interface IUserResponse {
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
  users: IUser[];
}

export interface IUser {
  company_id: number | null;
  cpf: string;
  email: string;
  user_id: number;
  user_name: string;
  partner_id: number | null;
  role: UserRole;
  telephone: string;
  allow_email_notifications: boolean;
  allow_sms_notifications: boolean;
  allow_wpp_notifications: boolean;
  person_responsible_id: number | null;
  consultant_hash: string;
  user_type: string;
  team: string;
  cnpj: string | undefined;
  created_at: string;
  updated_at: string;
  company: {
    company_id: number;
    company_name: string;
  };
  partner: {
    partner_id: number;
    partner_name: string;
    partner_hash: string;
  };
  person_responsible: {
    person_responsible_id: number;
    person_responsible_name: string;
    role: string;
    user_id: number;
    user_name: string;
  };
}

export interface ICreateUser {
  company_id: number | null;
  cpf: string;
  email: string;
  user_name: string;
  partner_id: number | null;
  password: string;
  role: UserRole;
  telephone: string;
  allow_email_notifications: boolean;
  allow_sms_notifications: boolean;
  allow_wpp_notifications: boolean;
  person_responsible_id: number | null;
  user_type: string;
  team: string;
  cnpj: string | undefined;
}

export interface IUpdateUser {
  company_id: number | null;
  cpf: string;
  email: string;
  user_id: number;
  user_name: string;
  partner_id: number | null;
  password?: string;
  role: UserRole;
  telephone: string;
  allow_email_notifications: boolean;
  allow_sms_notifications: boolean;
  allow_wpp_notifications: boolean;
  person_responsible_id: number | null;
  user_type: string;
  team: string;
  cnpj: string | undefined;
}

export interface IUserFilters {
  company_id?: number;
  partner_id?: number;
  segment?: string;
  page?: number;
  per_page?: number;
}
