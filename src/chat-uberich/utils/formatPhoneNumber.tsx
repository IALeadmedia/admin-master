export function formatPhoneNumber(phone: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  // Celular com DDD: 11 dígitos (ex: 11999999999)
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  // Fixo com DDD: 10 dígitos (ex: 1133334444)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  // Celular sem DDD: 9 dígitos (ex: 999999999)
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{5})(\d{4})/, "$1-$2");
  }
  // Fixo sem DDD: 8 dígitos (ex: 33334444)
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{4})(\d{4})/, "$1-$2");
  }
  // Se vier com código do país (ex: 5511999999999 ou 551133334444)
  if (cleaned.length === 13 && cleaned.startsWith("55")) {
    // 55 + DDD + 9 dígitos
    return cleaned.replace(/(55)(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
  }
  if (cleaned.length === 12 && cleaned.startsWith("55")) {
    // 55 + DDD + 8 dígitos
    return cleaned.replace(/(55)(\d{2})(\d{4})(\d{4})/, "+$1 ($2) $3-$4");
  }
  // Se não bater nenhum padrão, retorna o original
  return phone;
}
