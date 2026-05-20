import type { OrderAddressComplement } from "./base.type";

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
