export interface Extra {
  id: string;
  label: string;
  description?: string;
  images: string[];
  options: {
    id: string;
    label: string;
    price: number;
    description: string;
    bonus: {
      type: string;
      price: number;
      speed: number;
      description: string;
    };
  }[];
  input_type: "radio" | "checkbox" | "checkbox_group";
}
export interface Coverage {
  uf: string;
  cities: string[];
}
export interface IProduct {
  id: number;
  coverage: Coverage[];
  company: string;
  company_id: number;
  category: string;
  client_type: "PF" | "PJ";
  landing_page: string;
  name: string;
  online: boolean;
  offer_conditions: {
    url: string;
    type: string;
  }[];
  badge: string;
  offer_title: string;
  offer_subtitle: string;
  pricing: {
    base_monthly: { current_price: number; original_price?: number };
    installation: { current_price: number; original_price?: number };
  };
  details: {
    title: string;
    images: string[];
    description: string;
    highlight_top: boolean;
    highlight_bottom: boolean;
  }[];
  extras: {
    client: Extra[];
    non_client: Extra[];
  };
  uf: string[];
  created_at: string;
  updated_at: string;
  city?: string[];
}

export interface IProductsResponse {
  success: boolean;
  products: IProduct[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IProductFilters {
  page?: number;
  per_page?: number;
  perPage?: number;
  company_id?: number;
  company?: string;
  category?: string;
}

export interface CreatedProductResponse {
  id: number;
}
export interface ICreateProductApiResponse {
  product?: {
    id?: number | string;
  };
}

export interface ICreateProductPayload {
  entity: Record<string, unknown>;
  conditionFiles?: File[];
  detailsImages?: { detailIndex: number; files: File[] }[];
  extrasImages?: { extraId: string; files: File[] }[];
  company?: string;
  category?: string;
  city?: string[];
  uf?: string[];
  coverage?: Coverage[];
}
export interface UploadedProductDetailImageResponse {
  success?: boolean;
  url?: string;
  product?: IProduct;
}
export interface IUpdateProductPayload {
  id: number;
  entity: Record<string, unknown>;
  conditionFiles?: File[];
  detailsImages?: { detailIndex: number; files: File[] }[];
  extrasImages?: { extraId: string; files: File[] }[];
}

export interface IDeleteProductPayload {
  ids: number[];
  model?: ProductModel;
}
export type ProductModel = "telecom" | "finances" | "benefits";

export type ProductRequestEntity = FormData | Record<string, unknown>;
