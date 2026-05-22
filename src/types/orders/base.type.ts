export interface OrderAddressComplement {
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

export interface OrderFingerprint {
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

export interface OrderGeolocation {
  success: boolean;
  latitude: string;
  longitude: string;
  maps_link: string;
  precision: string;
  queried_at: string;
  street_view_link: string;
  formatted_address: string;
}

export interface OrderCompanyPartner {
  nome: string;
  cnpj: string;
  porte: string;
}

export interface OrderSelectedExtra {
  id: string;
  label: string;
  price: number;
  description?: string;
  bonus?: {
    type?: string;
    price?: number;
    speed?: number;
    description?: string;
  };
}

export interface OrderPriceSummary {
  plan_price?: number;
  extras_price?: number;
  total_monthly?: number;
  original_price?: number;
}

export interface OrderOperatorsAvailabilityItem {
  available: boolean;
  range_max: number | null;
  range_min: number | null;
  found_via_range: boolean;
}

export interface OrderOperatorsAvailability {
  tim?: OrderOperatorsAvailabilityItem;
  oi?: OrderOperatorsAvailabilityItem;
  claro?: OrderOperatorsAvailabilityItem;
  net?: OrderOperatorsAvailabilityItem;
  nio?: OrderOperatorsAvailabilityItem;
  sky?: OrderOperatorsAvailabilityItem;
  algar?: OrderOperatorsAvailabilityItem;
  [operatorName: string]: OrderOperatorsAvailabilityItem | undefined;
}

export interface OrderWhatsAppInfo {
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

export interface OrderBase {
  id: number;
  company?: string | null;
  company_id?: number | null;
  partner_id?: number | null;
  order_number?: number | null;
  order_token_active?: boolean;
  status: string;
  support?: string;
  after_sales_status?: string | null;
  full_name?: string | null;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  additional_phone?: string | null;
  birth_date?: string | null;
  mother_full_name?: string | null;
  cnpj?: string | null;
  payment_method?: string | null;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account_number?: string | null;
  bank_account_holder_name?: string | null;
  bank_account_holder_cpf?: string | null;
  company_legal_name?: string | null;
  business_partner?: string | null;
  landing_page?: string | null;
  category?: string | null;
  address?: string | null;
  address_number?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  single_zip_code?: boolean | undefined;
  address_complement?: OrderAddressComplement | null;
  consultant_observation?: string | null;
  responsible_consultant?: string | null;
  team?: string | null;
  client_ip?: string | null;
  fingerprint_id?: string | null;
  url?: string | null;
  created_at: string;
  updated_at: string;
}
