import type { OrderModule } from "@/services/orders.service";

export type TelecomOrderCategory = "banda-larga" | "telefonia-movel";
export type FinanceOrderCategory = "maquinha-cartao" | "conta-pj";
export type BenefitsOrderCategory = "beneficios";
export type OrderCategory =
  | TelecomOrderCategory
  | FinanceOrderCategory
  | BenefitsOrderCategory;

export interface SegmentConfig {
  /** Display label for this segment (e.g. "Financeiro"). */
  label: string;
  /** Whether orders are sub-divided by category. */
  hasCategories: boolean;
  /** Default category – used as URL param fallback; always defined even when hasCategories=false. */
  defaultCategory: OrderCategory;
  /** All valid categories for this segment. */
  categories: readonly OrderCategory[];
  /** Human-readable label for each category. */
  categoryLabelMap: Readonly<Record<string, string>>;
}

/**
 * Single source of truth for every order segment.
 *
 * When adding a new segment:
 *   1. Add the new string to the `OrderModule` union in `services/orders.service.ts`.
 *   2. Add an entry here — TypeScript will guide the rest.
 */
export const segmentRegistry: Record<OrderModule, SegmentConfig> = {
  telecom: {
    label: "Telecom",
    hasCategories: true,
    defaultCategory: "banda-larga",
    categories: ["banda-larga", "telefonia-movel"],
    categoryLabelMap: {
      "banda-larga": "Banda Larga",
      "telefonia-movel": "Telefonia Móvel",
    },
  },
  finances: {
    label: "Financeiro",
    hasCategories: false,
    defaultCategory: "maquinha-cartao",
    categories: [],
    categoryLabelMap: {
      "maquinha-cartao": "Maquininha",
      "conta-pj": "Conta PJ",
    },
  },
  benefits: {
    label: "Benefícios",
    hasCategories: false,
    defaultCategory: "beneficios",
    categories: ["beneficios"],
    categoryLabelMap: {
      beneficios: "Benefícios",
    },
  },
};
