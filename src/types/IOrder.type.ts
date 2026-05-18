export interface IOrderTelecomResponse {
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
  orders: IOrderTelecom[];
}

export interface IOperatorAvailabilityItem {
  available: boolean;
  range_max: number | null;
  range_min: number | null;
  found_via_range: boolean;
}

export interface IOperatorsAvailability {
  tim?: IOperatorAvailabilityItem;
  oi?: IOperatorAvailabilityItem;
  claro?: IOperatorAvailabilityItem;
  net?: IOperatorAvailabilityItem;
  nio?: IOperatorAvailabilityItem;
  sky?: IOperatorAvailabilityItem;
  algar?: IOperatorAvailabilityItem;
  [operatorName: string]: IOperatorAvailabilityItem | undefined;
}

export interface IPlanExtraBonus {
  type?: string;
  price?: number;
  speed?: number;
  description?: string;
}

export interface IOrderSelectedExtra {
  id: string;
  label: string;
  price: number;
  description?: string;
  bonus?: IPlanExtraBonus;
}

export interface IOrderTelecomPlan {
  id?: number | string;
  name?: string;
  speed?: string;
  value?: number;
  original_value?: number;
}

export interface IOrderAddressComplement {
  lot: string | null;
  block: string | null;
  floor: string | null;
  square: string | null;
  unit_type: string | null;
  unit_number: string | null;
  home_complement: string | null;
  reference_point: string | null;
  building_or_house: string | null;
}

export interface IOrderPriceSummary {
  plan_price?: number;
  extras_price?: number;
  total_monthly?: number;
  original_price?: number;
}

export interface IOrderGeolocation {
  success: boolean;
  latitude: string;
  longitude: string;
  maps_link: string;
  precision: string;
  queried_at: string;
  street_view_link: string;
  formatted_address: string;
}

export interface IOrderFingerprint {
  os?: {
    name?: string;
    version?: string;
  };
  device?: string;
  browser?: {
    name?: string;
    version?: string;
  };
  language?: string;
  timezone?: string;
  resolution?: {
    dpr?: number;
    width?: number;
    height?: number;
  };
  timezone_offset?: number;
  timezone_name?: string;
}

export interface IWhatsAppInfo {
  links: string[];
  avatar: string | null;
  numero: string | null;
  recado: string;
  sucesso: boolean;
  endereco: string | null;
  categoria: string;
  is_comercial: boolean;
  verificado_em: string;
  existe_no_whatsapp: boolean;
}

export type TelecomClientType = "PF" | "PJ";
export type TelecomLineAction =
  | "new_number"
  | "port_in_to_vivo"
  | "keep_vivo_number";

export interface IOrderTelecom {
  id: number;
  company?: string | null;
  company_id?: number | null;
  partner_id?: number | null;
  order_number?: number | null;
  order_token_active?: boolean;
  status: string;
  after_sales_status?: string | null;
  full_name?: string | null;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  additional_phone?: string | null;
  birth_date?: string | null;
  mother_full_name?: string | null;
  client_type?: TelecomClientType | null;
  channel?: string | null;
  business_partner?: string | null;
  category?: string | null;
  landing_page?: string | null;
  address_reference_point?: string | null;
  price_summary?: IOrderPriceSummary | null;
  line_action?: TelecomLineAction | null;
  line_number_informed?: string | null;
  wants_esim?: boolean | null;
  rg?: string | null;
  zip_code?: string | null;
  address?: string | null;
  address_number?: string | null;
  address_complement?: IOrderAddressComplement | null;
  address_block?: string | null;
  address_lot?: string | null;
  address_floor?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  cnpj?: string | null;
  company_legal_name?: string | null;
  plan?: IOrderTelecomPlan | null;
  selected_extras?: IOrderSelectedExtra[] | null;
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
  single_zip_code?: boolean | null;
  availability?: boolean | number | null;
  availability_pap?: boolean | number | null;
  ip_isp?: string | null;
  ip_org?: string | null;
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
  fingerprint?: IOrderFingerprint | null;
  fingerprint_id?: string | null;
  whatsapp?: IWhatsAppInfo | null;
  geolocation?: IOrderGeolocation | null;
  operators_availability?: IOperatorsAvailability | null;
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
  responsible_consultant?: string | null;
  team?: string | null;
  crm_id?: number | null;
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
  url?: string | null;
  message?: string | null;
  installation?: string | null;
  service?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IOrderTelecomFilters {
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
  landing_page?: string;
  business_partner?: string;
}
