export type {
  OrderAddressComplement,
  OrderBase,
  OrderCompanyPartner,
  OrderFingerprint,
  OrderGeolocation,
  OrderPriceSummary,
  OrderSelectedExtra,
  OrderWhatsAppInfo,
} from "./base.type";
export type {
  FinanceOrder,
  FinanceOrderFilters,
  FinanceOrderResponse,
  FinanceOrderFormValues,
} from "./finances.type";
export type {
  TelecomOrder,
  OrderOperatorsAvailability,
  TelecomOrderFilters,
  TelecomOrderResponse,
  TelecomOrderPlan,
  TelecomFormValues,
} from "./telecom.type";
export type {
  BenefitsOrder,
  BenefitsOrderFilters,
  BenefitsOrderResponse,
  BenefitsOrderFormValues,
} from "./benefits.type";
export type {
  OrderLogChange,
  OrderLogItem,
  OrderLogsResponse,
} from "./order-log.type";
import type {
  TelecomOrder,
  TelecomOrderFilters,
  TelecomOrderResponse,
} from "./telecom.type";
import type {
  FinanceOrder,
  FinanceOrderFilters,
  FinanceOrderResponse,
} from "./finances.type";
import type {
  BenefitsOrder,
  BenefitsOrderFilters,
  BenefitsOrderResponse,
} from "./benefits.type";
export type AnyOrder = TelecomOrder | FinanceOrder | BenefitsOrder;

export type AnyOrderResponse =
  | TelecomOrderResponse
  | FinanceOrderResponse
  | BenefitsOrderResponse;

export type AnyOrderFilters =
  | TelecomOrderFilters
  | FinanceOrderFilters
  | BenefitsOrderFilters;
