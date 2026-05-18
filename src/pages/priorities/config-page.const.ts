import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { usePartnerPriorityQuery } from "@/hooks/partners-prioritiy/usePartnerPriorityQuery";
import { useUpdatePartnerPriorityMutation } from "@/hooks/partners-prioritiy/useUpdatePartnerPriorityMutation";
import type { IPartner } from "@/types/IPartner.type";
import type { IPartnerPriority } from "@/types/IPartnerPriority.type";
import { UF_OPTIONS } from "@/utils/ufOptions";

export const entityPage = dictionaryQueryClient.partnerpriority;
export const useUpdateEntity = useUpdatePartnerPriorityMutation;
export const useListEntity = usePartnerPriorityQuery;
export type EntityType = IPartnerPriority;

const ufNameByCode = new Map(
  UF_OPTIONS.map((option) => {
    const [code, ...nameParts] = option.label.split(" - ");
    return [code, nameParts.join(" - ")];
  }),
);

export function getUfName(uf: string) {
  return ufNameByCode.get(uf) ?? uf;
}

export function normalizePartnerUfs(partner: IPartner): string[] {
  return Array.isArray(partner.uf)
    ? partner.uf
    : partner.uf
      ? [String(partner.uf)]
      : [];
}
