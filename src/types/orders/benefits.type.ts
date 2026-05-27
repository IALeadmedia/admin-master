import type { OrderAddressComplement, OrderBase } from "./base.type";

export interface BenefitsOrderResponse {
  orders: BenefitsOrder[];
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
}

export interface BenefitsOrderFilters {
  after_sales_status?: string | null;
  company_id?: number | string;
  contact_objective?: string;
  data_from?: string;
  data_to?: string;
  full_name?: string;
  landing_page?: string;
  order?: "asc" | "desc";
  order_number?: string | number;
  page?: string | number;
  per_page?: string | number;
  phone?: string;
  sort?: string;
  status?: string;
  partner_id?: number | string;
  cnpj?: string;
  cpf?: string;
}

export interface BenefitsOrder extends OrderBase {
  company_size_range?: string | null;
  contact_objective?: string | null;
}

export interface BenefitsOrderFormValues {
  company_id?: number;
  company_size_range?: string;
  contact_objective?: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  address?: string;
  address_complement?: Partial<OrderAddressComplement>;
  address_number?: string;
  district?: string;
  state?: string;
  zip_code?: string;
  single_zip_code?: boolean;
  consultant_observation?: string;
  city?: string;
}
