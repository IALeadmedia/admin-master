import type {
  OrderAddressComplement,
  OrderBase,
  OrderCompanyPartner,
  OrderFingerprint,
  OrderGeolocation,
  OrderWhatsAppInfo,
} from "./base.type";

export interface FinanceOrderResponse {
  success: boolean;
  orders: FinanceOrder[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  status_pos_venda_enum: string[];
}

export interface FinanceOrderFilters {
  page?: string | number;
  per_page?: string | number;
  data_from?: string;
  data_to?: string;
  status?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  order_number?: string | number;
  sort?: string;
  order?: "asc" | "desc";
  after_sales_status?: string | null;
}

export interface FinanceOrder extends OrderBase {
  order_type?: string;
  product_account_opening?: boolean | null;
  product_card_machine?: boolean | null;
  product_credit_card?: boolean | null;
  product_loan?: boolean | null;
  loan_amount?: number | null;
  products_of_interest?: string[] | string | null;

  app_click?: boolean | null;
  app_click_at?: string | null;
  app_register?: boolean | null;
  app_register_at?: string | null;

  pf_temperature?: number | null;
  temperatura_pf?: number | null;
  rfb_name?: string | null;
  rfb_mother_name?: string | null;
  rfb_birth_date?: string | null;
  rfb_gender?: string | null;
  phone_valid?: boolean | null;
  operator?: string | null;
  portability?: string | null;
  portability_date?: string | null;
  is_email_valid?: boolean | null;
  whatsapp?: OrderWhatsAppInfo | null;
  existe_no_whatsapp?: boolean | null;
  fingerprint?: OrderFingerprint | null;
  corporate_id?: string | null;
  crm_id?: string | null;
  ip_access_type?: string | null;
  ip_isp?: string | null;
  ip_org?: string | null;
  ip_as?: string | null;
  is_socio?: boolean | null;
  is_mei?: boolean | null;
  company_partners?: OrderCompanyPartner[] | string | null;
  geolocation?: OrderGeolocation | null;
  support?: string;
  credit?: number | string | null;
  consultant_notes?: string | null;
  consultant_observation?: string | null;
  manager_name?: string | null;
  manager?: Record<string, unknown> | null;
  is_consultation?: boolean | null;
  is_order?: boolean | null;
  consultation_id?: string | null;
  order_id?: string | null;
  highlight_top?: string | null;
  highlight_bottom?: string | null;
  message?: string | null;
  installation?: string | null;
  service?: string | null;
  company_legal_name?: string | null;
  address_complement?: OrderAddressComplement | null;
}

export interface FinanceOrderFormValues {
  full_name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  single_zip_code?: boolean;
  consultant_observation?: string;
  address_complement?: Partial<OrderAddressComplement>;
}
