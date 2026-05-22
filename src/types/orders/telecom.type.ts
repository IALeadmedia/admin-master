import type { Dayjs } from "dayjs";
import type {
  OrderAddressComplement,
  OrderBase,
  OrderFingerprint,
  OrderGeolocation,
  OrderOperatorsAvailability,
  OrderPriceSummary,
  OrderSelectedExtra,
  OrderWhatsAppInfo,
} from "./base.type";

export interface TelecomOrderResponse {
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
  orders: TelecomOrder[];
}

export interface TelecomOrderFilters {
  page?: string | number;
  per_page?: string | number;
  data_to?: string;
  data_from?: string;
  status?: string;
  after_sales_status?: string | null;
  availability?: string | number | boolean;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  sort?: string;
  order?: "asc" | "desc";
  order_number?: string | number;
  company_id?: number;
  partner_id?: number;
  category?: string;
  client_type?: "PF" | "PJ";
  landing_page?: string;
  business_partner?: string;
}

export interface TelecomOperatorsAvailabilityItem {
  available: boolean;
  range_max: number | null;
  range_min: number | null;
  found_via_range: boolean;
}

export interface TelecomOperatorsAvailability {
  tim?: TelecomOperatorsAvailabilityItem;
  oi?: TelecomOperatorsAvailabilityItem;
  claro?: TelecomOperatorsAvailabilityItem;
  net?: TelecomOperatorsAvailabilityItem;
  nio?: TelecomOperatorsAvailabilityItem;
  sky?: TelecomOperatorsAvailabilityItem;
  algar?: TelecomOperatorsAvailabilityItem;
  [operatorName: string]: TelecomOperatorsAvailabilityItem | undefined;
}

export interface TelecomOrderPlan {
  id?: number | string;
  name?: string;
  speed?: string;
  value?: number;
  original_value?: number;
}

export interface TelecomOrder extends OrderBase {
  client_type?: "PF" | "PJ" | null;
  channel?: string | null;
  address_reference_point?: string | null;
  price_summary?: OrderPriceSummary | null;
  line_action?: "new_number" | "port_in_to_vivo" | "keep_vivo_number" | null;
  line_number_informed?: string | null;
  wants_esim?: boolean | null;
  rg?: string | null;
  plan?: TelecomOrderPlan | null;
  selected_extras?: OrderSelectedExtra[] | null;
  due_day?: string | number | null;
  terms_accepted?: boolean | null;
  accept_offers?: boolean | null;
  installation_preferred_date_one?: string | null;
  installation_preferred_period_one?: string | null;
  installation_preferred_date_two?: string | null;
  installation_preferred_period_two?: string | null;
  installation_preferred_date_three?: string | null;
  installation_preferred_period_three?: string | null;
  payment_method?: string | null;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account_number?: string | null;
  bank_account_holder_name?: string | null;
  bank_account_holder_cpf?: string | null;
  has_fixed_line_portability?: boolean | null;
  fixed_line_number_to_port?: string | null;
  wants_fixed_ip?: boolean | null;
  phone_valid?: boolean | null;
  operator?: string | null;
  portability?: string | null;
  portability_date?: string | null;
  additional_phone_valid?: boolean | null;
  additional_operator?: string | null;
  additional_portability?: string | null;
  additional_portability_date?: string | null;
  is_email_valid?: boolean | null;
  found_via_range?: boolean | null;
  range_min?: string | number | null;
  range_max?: string | number | null;
  zip_code_type?: string | null;
  availability?: boolean | number | null;
  availability_pap?: boolean | number | null;
  ip_isp?: string | null;
  ip_org?: string | null;
  support?: string;
  ip_as?: string | null;
  ip_access_type?: string | null;
  is_socio?: boolean | null;
  is_mei?: boolean | null;
  company_partners?: string | null;
  rfb_name?: string | null;
  rfb_birth_date?: string | null;
  rfb_mother_name?: string | null;
  rfb_gender?: string | null;
  client_ip?: string | null;
  fingerprint?: OrderFingerprint | null;
  geolocation?: OrderGeolocation | null;
  operators_availability?: OrderOperatorsAvailability | null;
  pf_temperature?: number | null;
  credit?: number | string | null;
  cpf_second_call?: string | null;
  birth_date_second_call?: string | null;
  full_name_second_call?: string | null;
  mother_full_name_second_call?: string | null;
  phone_second_call?: string | null;
  email_second_call?: string | null;
  rg_second_call?: string | null;
  rg_issuer_second_call?: string | null;
  rg_issue_date_second_call?: string | null;
  cnpj_second_call?: string | null;
  whatsapp?: OrderWhatsAppInfo | null;
  company_legal_name_second_call?: string | null;
  manager_second_call?: string | null;
  zip_code_second_call?: string | null;
  address_second_call?: string | null;
  address_number_second_call?: string | null;
  district_second_call?: string | null;
  city_second_call?: string | null;
  state_second_call?: string | null;
  address_complement_second_call?: string | null;
  due_day_second_call?: string | null;
  payment_method_second_call?: string | null;
  bank_name_second_call?: string | null;
  bank_branch_second_call?: string | null;
  bank_account_number_second_call?: string | null;
  bank_account_holder_name_second_call?: string | null;
  bank_account_holder_cpf_second_call?: string | null;
  installation_preferred_date_one_second_call?: string | null;
  installation_preferred_period_one_second_call?: string | null;
  installation_preferred_date_two_second_call?: string | null;
  installation_preferred_period_two_second_call?: string | null;
  installation_preferred_date_three_second_call?: string | null;
  installation_preferred_period_three_second_call?: string | null;
  additional_phone_second_call?: string | null;
  terms_accepted_second_call?: boolean | null;
  accept_offers_second_call?: boolean | null;
  number_attempts_second_call?: number | null;
  second_call_token?: string | null;
  second_call_token_expires_at?: string | null;
  second_call_data?: Record<string, unknown> | null;
  corporate_id?: string | null;
  crm_id?: number | null;
  consultant_notes?: string | null;
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
}

export type FormValues = {
  plan_id?: number | string;
  selected_extras?: Array<number | string>;
  installation_preferred_date_one?: string | Dayjs;
  installation_preferred_period_one?: string;
  installation_preferred_date_two?: string | Dayjs;
  installation_preferred_period_two?: string;
  due_day?: string | number;
  availability_pap?: boolean;
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  email?: string;
  mother_full_name?: string;
  phone?: string;
  additional_phone?: string;
  cnpj?: string;
  payment_method?: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account_number?: string;
  bank_account_holder_name?: string;
  bank_account_holder_cpf?: string;
  address?: string;
  address_number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  single_zip_code?: boolean;
  consultant_observation?: string;
  address_complement?: Partial<OrderAddressComplement>;
};
