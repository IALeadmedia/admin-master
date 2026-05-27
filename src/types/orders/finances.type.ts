import type { OrderAddressComplement, OrderBase } from "./base.type";

export interface FinanceOrder extends OrderBase {
  // Engajamento com app
  app_click?: boolean | null;
  app_click_at?: string | null;
  app_register?: boolean | null;
  app_register_at?: string | null;

  loan_amount?: number | null;

  order_type?: string;

  // Tipo e produtos
  product_account_opening?: boolean | null;
  product_card_machine?: boolean | null;
  product_credit_card?: boolean | null;
  product_loan?: boolean | null;
  products_of_interest?: string[] | string | null;
}

export interface FinanceOrderFilters {
  after_sales_status?: string | null;
  cnpj?: string;
  cpf?: string;
  data_from?: string;
  data_to?: string;
  order?: "asc" | "desc";
  order_number?: string | number;
  page?: string | number;
  per_page?: string | number;
  phone?: string;
  sort?: string;
  status?: string;
  company_id?: string | number;
  partner_id?: string | number;
}

export interface FinanceOrderFormValues {
  address?: string;
  address_complement?: Partial<OrderAddressComplement>;
  address_number?: string;
  city?: string;
  consultant_observation?: string;
  cpf?: string;
  district?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  single_zip_code?: boolean;
  state?: string;
  zip_code?: string;
}

export interface FinanceOrderResponse {
  orders: FinanceOrder[];
  page: number;
  perPage: number;
  status_pos_venda_enum: string[];
  success: boolean;
  total: number;
  totalPages: number;
}
