export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  // Com DDI 55 (deve vir antes para não conflitar com os demais)
  if (cleaned.length === 13 && cleaned.startsWith("55")) {
    return cleaned.replace(/(55)(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
  }
  if (cleaned.length === 12 && cleaned.startsWith("55")) {
    return cleaned.replace(/(55)(\d{2})(\d{4})(\d{4})/, "+$1 ($2) $3-$4");
  }
  // Com DDD
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Sem DDD
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{5})(\d{4})/, "$1-$2");
  }
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{4})(\d{4})/, "$1-$2");
  }

  return phone;
}

export function formatBRL(value: number | undefined): string {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseDecimalValue(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  if (!normalized) return fallback;

  const sanitized = normalized
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const formatPaymentMethod = (method?: string | null) => {
  if (!method) return "-";

  const paymentMethodLabels: Record<string, string> = {
    automatic_debit: "Debito Automatico",
    credit_card: "Cartao de Credito",
    boleto: "Boleto",
    pix: "PIX",
  };

  return paymentMethodLabels[method] || method;
};
