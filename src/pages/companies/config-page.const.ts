import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { useCreateCompanyMutation } from "@/hooks/companies/useCreateCompanyMutation";
import { useDeleteCompanyMutation } from "@/hooks/companies/useDeleteCompanyMutation";
import { useUpdateCompanyMutation } from "@/hooks/companies/useUpdateCompanyMutation";
import type { ICompany } from "@/types/ICompany.type";

export const entityPage = dictionaryQueryClient.companies;
export const useCreateEntity = useCreateCompanyMutation;
export const useUpdateEntity = useUpdateCompanyMutation;
export const useDeleteEntity = useDeleteCompanyMutation;
export const useListEntity = useCompanyQuery;
export type EntityType = ICompany;

export type FormValues = {
  cnpj: string;
  company_name: string;
  manager_name: string;
  telephone: string;
  email: string;
  logo_url: File;
  company_id: number;
  segment: string;
  category?: string[];
};
