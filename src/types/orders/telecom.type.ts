import type { Dayjs } from "dayjs";
import type {
  OrderAddressComplement,
  OrderBase,
  OrderPriceSummary,
  OrderSelectedExtra,
} from "./base.type";

export interface OrderOperatorsAvailability {
  algar?: OrderOperatorsAvailabilityItem;
  claro?: OrderOperatorsAvailabilityItem;
  net?: OrderOperatorsAvailabilityItem;
  nio?: OrderOperatorsAvailabilityItem;
  oi?: OrderOperatorsAvailabilityItem;
  sky?: OrderOperatorsAvailabilityItem;
  tim?: OrderOperatorsAvailabilityItem;
  vero?: OrderOperatorsAvailabilityItem;
  [operatorName: string]: OrderOperatorsAvailabilityItem | undefined;
}

export interface OrderOperatorsAvailabilityItem {
  available: boolean;
  found_via_range: boolean;
  range_max: number | null;
  range_min: number | null;
  availability?: boolean;
  encontrado_via_range?: boolean;
}

export interface TelecomOrder extends OrderBase {
  // Portabilidade adicional
  additional_operator?: string | null;
  additional_phone?: string | null;
  additional_phone_second_call?: string | null;
  additional_phone_valid?: boolean | null;
  additional_portability?: string | null;
  additional_portability_date?: string | null;

  // Cobrança
  accept_offers?: boolean | null;
  accept_offers_second_call?: boolean | null;

  address_complement_second_call?: string | null;
  address_number_second_call?: string | null;
  address_second_call?: string | null;

  // Disponibilidade
  availability?: boolean | number | null;
  availability_pap?: boolean | number | null;

  bank_account_holder_cpf_second_call?: string | null;
  bank_account_holder_name_second_call?: string | null;
  bank_account_number_second_call?: string | null;
  bank_branch_second_call?: string | null;
  bank_name_second_call?: string | null;
  birth_date_second_call?: string | null;

  city_second_call?: string | null;
  cnpj_second_call?: string | null;
  company_legal_name_second_call?: string | null;
  cpf_second_call?: string | null;

  district_second_call?: string | null;

  due_day?: string | number | null;
  due_day_second_call?: string | null;

  email_second_call?: string | null;

  fixed_line_number_to_port?: string | null;
  found_via_range?: boolean | null;
  full_name_second_call?: string | null;

  has_fixed_line_portability?: boolean | null;

  // Instalação
  installation_preferred_date_one?: string | null;
  installation_preferred_date_one_second_call?: string | null;
  installation_preferred_date_three?: string | null;
  installation_preferred_date_three_second_call?: string | null;
  installation_preferred_date_two?: string | null;
  installation_preferred_date_two_second_call?: string | null;
  installation_preferred_period_one?: string | null;
  installation_preferred_period_one_second_call?: string | null;
  installation_preferred_period_three?: string | null;
  installation_preferred_period_three_second_call?: string | null;
  installation_preferred_period_two?: string | null;
  installation_preferred_period_two_second_call?: string | null;

  // Linha móvel
  line_action?: "new_number" | "port_in_to_vivo" | "keep_vivo_number" | null;
  line_number_informed?: string | null;

  manager_second_call?: string | null;
  mother_full_name_second_call?: string | null;

  number_attempts_second_call?: number | null;

  operators_availability?: OrderOperatorsAvailability | null;

  payment_method_second_call?: string | null;

  // Plano e extras
  plan?: TelecomOrderPlan | null;
  price_summary?: OrderPriceSummary | null;

  range_max?: string | number | null;
  range_min?: string | number | null;

  rg?: string | null;
  rg_issue_date_second_call?: string | null;
  rg_issuer_second_call?: string | null;
  rg_second_call?: string | null;

  second_call_data?: Record<string, unknown> | null;
  second_call_token?: string | null;
  second_call_token_expires_at?: string | null;

  selected_extras?: OrderSelectedExtra[] | null;

  state_second_call?: string | null;

  terms_accepted?: boolean | null;
  terms_accepted_second_call?: boolean | null;

  wants_esim?: boolean | null;
  wants_fixed_ip?: boolean | null;

  zip_code_second_call?: string | null;
}

export interface TelecomOrderFilters {
  after_sales_status?: string | null;
  availability?: string | number | boolean;
  business_partner?: string;
  category?: string;
  client_type?: "PF" | "PJ";
  cnpj?: string;
  company_id?: number | string;
  cpf?: string;
  data_from?: string;
  data_to?: string;
  landing_page?: string;
  order?: "asc" | "desc";
  order_number?: string | number;
  page?: string | number;
  partner_id?: number | string;
  per_page?: string | number;
  phone?: string;
  sort?: string;
  status?: string;
}

export interface TelecomOrderPlan {
  id?: number | string;
  name?: string;
  original_value?: number;
  speed?: string;
  value?: number;
}

export interface TelecomOrderResponse {
  orders: TelecomOrder[];
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
}

export type TelecomFormValues = {
  additional_phone?: string;
  address?: string;
  address_complement?: Partial<OrderAddressComplement>;
  address_number?: string;
  availability_pap?: boolean;
  bank_account_holder_cpf?: string;
  bank_account_holder_name?: string;
  bank_account_number?: string;
  bank_branch?: string;
  bank_name?: string;
  birth_date?: string;
  city?: string;
  cnpj?: string;
  consultant_observation?: string;
  cpf?: string;
  district?: string;
  due_day?: string | number;
  email?: string;
  full_name?: string;
  installation_preferred_date_one?: string | Dayjs;
  installation_preferred_date_three?: string | Dayjs;
  installation_preferred_date_two?: string | Dayjs;
  installation_preferred_period_one?: string;
  installation_preferred_period_three?: string;
  installation_preferred_period_two?: string;
  mother_full_name?: string;
  payment_method?: string;
  phone?: string;
  plan_id?: number | string;
  selected_extras?: Array<number | string>;
  single_zip_code?: boolean;
  state?: string;
  zip_code?: string;
};
