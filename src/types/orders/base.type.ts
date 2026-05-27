export interface OrderAddressComplement {
  block: string | null;
  building_or_house: string | null;
  floor: string | null;
  home_complement: string | null;
  lot: string | null;
  reference_point: string | null;
  square: string | null;
  unit_number: string | null;
  unit_type: string | null;
}

export interface OrderFingerprint {
  browser?: {
    name?: string;
    version?: string;
  };
  device?: string;
  language?: string;
  os?: {
    name?: string;
    version?: string;
  };
  resolution?: {
    dpr?: number;
    height?: number;
    width?: number;
  };
  timezone?: string;
  timezone_name?: string;
  timezone_offset?: number;
}

export interface OrderGeolocation {
  formatted_address: string;
  latitude: string;
  longitude: string;
  maps_link: string;
  precision: string;
  queried_at: string;
  street_view_link: string;
  success: boolean;
}

export interface OrderCompanyPartner {
  cnpj: string;
  nome: string;
  porte: string;
}

export interface OrderSelectedExtra {
  bonus?: {
    description?: string;
    price?: number;
    speed?: number;
    type?: string;
  };
  description?: string;
  id: string;
  label: string;
  price: number;
}

export interface OrderPriceSummary {
  extras_price?: number;
  original_price?: number;
  plan_price?: number;
  total_monthly?: number;
}

export interface OrderWhatsAppInfo {
  avatar: string | null;
  categoria: string;
  endereco: string | null;
  existe_no_whatsapp: boolean;
  is_comercial: boolean;
  links: string[];
  numero: string | null;
  recado: string;
  sucesso: boolean;
  verificado_em: string;
}

export interface OrderBase {
  address?: string | null;
  address_complement?: OrderAddressComplement | null;
  address_number?: string | null;
  additional_phone?: string | null;
  partner_id?: number | null;
  after_sales_status?: string | null;
  bank_account_holder_cpf?: string | null;
  bank_account_holder_name?: string | null;
  bank_account_number?: string | null;
  bank_branch?: string | null;
  bank_name?: string | null;
  birth_date?: string | null;
  business_partner?: string | null;
  category?: string | null;
  city?: string | null;
  client_ip?: string | null;
  client_type?: "PF" | "PJ" | null;
  cnpj?: string | null;
  company?: string | null;
  company_id?: number | null;
  company_legal_name?: string | null;
  company_partners?: OrderCompanyPartner[] | string | null;
  consultation_id?: string | null;
  consultant_notes?: string | null;
  consultant_observation?: string | null;
  corporate_id?: string | null;
  cpf?: string | null;
  created_at: string;
  credit?: number | string | null;
  crm_id?: string | number | null;
  district?: string | null;
  email?: string | null;
  fingerprint?: OrderFingerprint | null;
  fingerprint_id?: string | null;
  full_name?: string | null;
  geolocation?: OrderGeolocation | null;
  highlight_bottom?: string | null;
  highlight_top?: string | null;
  id: number;
  installation?: string | null;
  ip_access_type?: string | null;
  ip_as?: string | null;
  ip_isp?: string | null;
  ip_org?: string | null;
  is_consultation?: boolean | null;
  is_email_valid?: boolean | null;
  is_mei?: boolean | null;
  is_order?: boolean | null;
  is_socio?: boolean | null;
  landing_page?: string | null;
  manager?: Record<string, unknown> | null;
  manager_name?: string | null;
  message?: string | null;
  mother_full_name?: string | null;
  operator?: string | null;
  order_id?: string | null;
  order_number?: number | null;
  order_token_active?: boolean;
  payment_method?: string | null;
  pf_temperature?: number | null;
  phone?: string | null;
  phone_valid?: boolean | null;
  portability?: string | null;
  portability_date?: string | null;
  responsible_consultant?: string | null;
  rfb_birth_date?: string | null;
  rfb_gender?: string | null;
  rfb_mother_name?: string | null;
  rfb_name?: string | null;
  service?: string | null;
  single_zip_code?: boolean | undefined;
  state?: string | null;
  status: string;
  support?: string;
  team?: string | null;
  updated_at: string;
  url?: string | null;
  whatsapp?: OrderWhatsAppInfo | null;
  zip_code?: string | null;
  zip_code_type?: string | null;
}
