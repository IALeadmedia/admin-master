export interface ICompanyResponse {
  page: number;
  per_page: number;
  success: boolean;
  total: number;
  total_pages: number;
  companies: ICompany[];
}

export interface ICompany {
  cnpj?: string;
  email?: string;
  company_id: number;
  company_name: string;
  manager_name?: string;
  telephone?: string;
  segment: string;
  created_at: string;
  updated_at: string;
  _count: {
    users: number;
    partners: number;
  };
  category?: string[];
}

export interface ICreateCompany {
  company_id: number;
  cnpj?: string;
  email?: string;
  company_name: string;
  telephone?: string;
  manager_name?: string;
  segment: string;
  category?: string[];
}

export interface IUpdateCompany {
  company_id: number;
  cnpj?: string;
  email?: string;
  company_name: string;
  telephone?: string;
  manager_name?: string;
  segment: string;
  category?: string[];
}

export interface ICompanyFilters {
  segment?: string;
  page?: number;
  per_page?: number;
}
