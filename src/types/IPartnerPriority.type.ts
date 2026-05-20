export type IPartnerPriorityClientType = "PF" | "PJ";

export interface IPartnerPriority {
  id: number;
  company_id: number;
  partner_id: number;
  uf: string;
  category: string;
  client_type: IPartnerPriorityClientType;
  created_at?: string;
  updated_at?: string;
  partner?: {
    category: string[];
    partner_id: number;
    partner_name: string;
    partner_hash?: string;
    logo_url?: string;
    uf?: string[];
    client_type?: IPartnerPriorityClientType[];
  };
  company?: {
    company_id: number;
    company_name: string;
  };
}

export interface IPartnerPriorityFilters {
  company_id?: number;
  client_type?: IPartnerPriorityClientType;
  uf?: string;
  category?: string;
}

export interface IUpdatePartnerPriorityPayload {
  company_id: number;
  partner_id: number;
  uf: string;
  category: string;
  client_type: IPartnerPriorityClientType;
}

export interface IPartnerPriorityListResponse {
  success: boolean;
  priorities: IPartnerPriority[];
}

export interface IPartnerPriorityResolveResponse {
  success: boolean;
  error?: string;
  partner_hash?: string;
  partner_id?: number;
  partner_name?: string;
  logo_url?: string;
  uf?: string;
  client_type?: IPartnerPriorityClientType;
  category?: string;
}
