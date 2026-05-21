export interface IPartnerResponse {
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
  partners: IPartner[];
}

export interface IPartner {
  cnpj: string;
  email: string;
  category: string[];
  partner_id: number;
  logo_url: string | null;
  manager_name: string;
  partner_name: string;
  company_id: number;
  telephone: string;
  partner_hash: string;
  created_at: string;
  updated_at: string;
  company: {
    company_id: number;
    company_name: string;
  };
  _count: {
    users: number;
  };
  uf: string[];
  client_type: string[];
}

export interface ICreatePartner {
  partner_id?: number;
  cnpj: string;
  email: string;
  logo_url?: string | null;
  manager_name: string;
  partner_name: string;
  telephone: string;
  company_id: number;
  company: {
    company_id: number;
    company_name: string;
  };
  uf: string[];
  client_type: string[];
  category?: string[];
}

export interface ICreatePartnerPayload {
  entity: ICreatePartner;
  logoFile?: File;
}

export interface ICreatePartnerResponse {
  success: boolean;
  partner: IPartner;
}

export interface IUpdatePartner {
  cnpj: string;
  email: string;
  partner_id: number;
  logo_url?: string | null;
  manager_name: string;
  partner_name: string;
  category?: string[];
  telephone: string;
  company_id: number;
  company: {
    company_id: number;
    company_name: string;
  };
  uf: string[];
  client_type: string[];
}

export interface IUpdatePartnerPayload {
  entity: IUpdatePartner;
  logoFile?: File;
}

export interface IPartnerFilters {
  company_id?: number;
  partner_id?: number;
  segment?: string;
  page?: number;
  per_page?: number;
}
