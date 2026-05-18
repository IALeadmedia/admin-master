import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";
import { useOrderQuery } from "@/hooks/orders/useOrderQuery";
import { useUpdateOrderMutation } from "@/hooks/orders/useUpdateOrderMutation";
import type { Dayjs } from "dayjs";
import type {
  IOrderAddressComplement,
  IOrderTelecom,
} from "@/types/IOrder.type";

export const entityPage = dictionaryQueryClient.orders;
export const useUpdateEntity = useUpdateOrderMutation;
export const useDeleteEntity = useDeleteOrderMutation;
export const useListEntity = useOrderQuery;
export type EntityType = IOrderTelecom;

export type FormValues = {
  plan_id?: number | string;
  selected_extras?: Array<number | string>;
  installation_preferred_date_one?: string | Dayjs;
  installation_preferred_period_one?: string;
  installation_preferred_date_two?: string | Dayjs;
  installation_preferred_period_two?: string;
  due_day?: number;
  availability_pap?: boolean;
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  email?: string;
  mother_full_name?: string;
  phone?: string;
  additional_phone?: string;
  cnpj?: string;
  address?: string;
  address_number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  single_zip_code?: boolean;
  consultant_observation?: string;
  address_complement?: Partial<IOrderAddressComplement>;
};
