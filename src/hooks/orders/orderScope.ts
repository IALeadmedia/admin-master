import { appSetting } from "@/constants/app-setting/config.const";
import type { OrderModule } from "@/services/orders.service";

export type OrderOperator =
  | "tim"
  | "claro"
  | "vivo"
  | "vr"
  | "c6"
  | "algar"
  | "brisanet"
  | "nio"
  | "vero";

const validOrderModules = new Set<OrderModule>([
  "telecom",
  "finances",
  "benefits",
]);

const validOrderOperators = new Set<OrderOperator>([
  "tim",
  "claro",
  "vivo",
  "vr",
  "c6",
  "algar",
  "brisanet",
  "nio",
  "vero",
]);

// Mapeia operadora → módulo para usuários não-admin
export const operatorModuleMap: Record<string, OrderModule> = {
  tim: "telecom",
  claro: "telecom",
  vivo: "telecom",
  algar: "telecom",
  brisanet: "telecom",
  nio: "telecom",
  vero: "telecom",
  vr: "benefits",
  c6: "finances",
};

export function isOrderModule(value?: string): value is OrderModule {
  return !!value && validOrderModules.has(value as OrderModule);
}

export function isOrderOperator(value?: string): value is OrderOperator {
  return !!value && validOrderOperators.has(value as OrderOperator);
}

/** Resolve o módulo: prioridade = explícito → segmentId do scope → derivado do operador → fallback telecom */
export function resolveOrderModule(
  segmentId?: string,
  explicitModule?: OrderModule,
  derivedFromOperator?: string,
): OrderModule {
  if (explicitModule) return explicitModule;
  if (isOrderModule(segmentId)) return segmentId;
  if (derivedFromOperator) {
    const mapped = operatorModuleMap[derivedFromOperator.toLowerCase()];
    if (mapped) return mapped;
  }
  return "telecom";
}

/** Resolve o operador: prioridade = explícito → appSetting.name (não-admin) → fallback tim */
export function resolveOrderOperator(
  explicitOperator?: string,
  _isAdminContext?: boolean,
): OrderOperator {
  const normalizedExplicit = explicitOperator?.toLowerCase();
  if (
    normalizedExplicit &&
    validOrderOperators.has(normalizedExplicit as OrderOperator)
  ) {
    return normalizedExplicit as OrderOperator;
  }

  // Em contexto não-admin, tenta usar appSetting.name (domínio específico)
  const normalizedAppSetting = appSetting.name.toLowerCase();

  if (validOrderOperators.has(normalizedAppSetting as OrderOperator)) {
    return normalizedAppSetting as OrderOperator;
  }

  // Fallback final: tim
  return "tim";
}
