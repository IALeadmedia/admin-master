import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCreatePartnerMutation } from "@/hooks/partners/useCreatePartnerMutation";
import { useDeletePartnerMutation } from "@/hooks/partners/useDeletePartnerMutation";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useUpdatePartnerMutation } from "@/hooks/partners/useUpdatePartnerMutation";
import type { IPartner } from "@/types/IPartner.type";
import type { UploadFile } from "antd";

export const entityPage = dictionaryQueryClient.partners;
export const useCreateEntity = useCreatePartnerMutation;
export const useUpdateEntity = useUpdatePartnerMutation;
export const useDeleteEntity = useDeletePartnerMutation;
export const useListEntity = usePartnerQuery;
export type EntityType = IPartner;

export type FormValues = {
  cnpj: string;
  partner_name: string;
  manager_name: string;
  telephone: string;
  email: string;
  logo_url?: string | null;
  logo_file?: UploadFile[];
  id: string;
  partner_id: number;
  partner_hash: string;
  company_id: number;
  company: {
    company_id: number;
    company_name: string;
  };
  uf: string[];
  client_type: string[];
  category: string[];
  clientId_uberich: string;
};
