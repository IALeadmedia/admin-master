import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import type { OrderModule } from "@/services/orders.service";
import { resolveOrderModule, resolveOrderOperator } from "./orderScope";

export interface ResolvedOrderScope {
  /** Módulo usado no path da URL: telecom | financies | benefits */
  resolvedModule: OrderModule;
  /** Operadora usada no path da URL quando a rota depende de empresa. */
  resolvedOperator?: string;
  /** company_id resolvido para filtros de query */
  resolvedCompanyId: number | undefined;
  /** partner_id resolvido para filtros de query */
  resolvedPartnerId: number | undefined;
}

/**
 * Resolve module, operator, company_id e partner_id para os hooks de orders.
 *
 * Lógica:
 * - ADMIN (isAdminDomain && role=ADMIN):
 *     module  = selectedSegmentId do AdminScopeContext
 *     operator = company_name da empresa selecionada (normalizado para minúsculo)
 *     company_id = selectedCompanyId
 *     partner_id = selectedPartnerId
 *
 * - Usuário regular (non-admin domain):
 *     operator = appSetting.name (nome do portal, ex: "Tim", "C6")
 *     module  = derivado do operador via operatorModuleMap
 *     company_id = user.company_id
 *     partner_id = user.partner_id
 */
export function useResolvedOrderScope(
  explicitModule?: OrderModule,
): ResolvedOrderScope {
  const { user, isGlobalAdmin } = useAuth();
  const { selectedSegmentId, selectedCompanyId, selectedPartnerId } =
    useAdminScope();

  const isAdmin = isAdminDomain && isGlobalAdmin;

  // Busca empresas: no admin sempre, no non-admin quando há company_id do user
  const { data: companiesData } = useCompanyQuery({
    enabled: isAdmin || (!!user?.user.company_id && !isAdmin),
  });

  if (isAdmin) {
    const selectedCompany = companiesData?.companies.find(
      (c) => c.company_id === selectedCompanyId,
    );

    const operatorFromCompany = selectedCompany?.company_name
      ?.split(" ")[0]
      ?.toLowerCase()
      .trim();

    const resolvedModule = resolveOrderModule(
      selectedSegmentId,
      explicitModule,
    );
    const resolvedOperator =
      selectedCompanyId != null
        ? resolveOrderOperator(operatorFromCompany, true)
        : undefined;

    return {
      resolvedModule,
      resolvedOperator,
      resolvedCompanyId: selectedCompanyId,
      resolvedPartnerId: selectedPartnerId,
    };
  }

  // Usuário regular: busca sua própria empresa e usa o company_name como operador
  const userCompanyId = user?.user.company_id ?? undefined;
  const userCompany = companiesData?.companies.find(
    (c) => c.company_id === userCompanyId,
  );

  // operator vem da primeira palavra do company_name (ex: "C6 Bank" → "c6")
  const operatorFromUserCompany = userCompany?.company_name
    ?.split(" ")[0] // extrai primeira palavra
    ?.toLowerCase()
    .trim();

  // Fallback: tenta appSetting.name se não conseguir da empresa
  const resolvedOperator = resolveOrderOperator(operatorFromUserCompany, false);
  const resolvedModule = resolveOrderModule(
    undefined,
    explicitModule,
    resolvedOperator,
  );

  return {
    resolvedModule,
    resolvedOperator,
    resolvedCompanyId: userCompanyId,
    resolvedPartnerId: user?.user.partner_id ?? undefined,
  };
}
