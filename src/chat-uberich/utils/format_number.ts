export function formatPhoneNumber(tel: string) {
  // Remove qualquer caractere que não seja número
  tel = tel?.replace(/\D/g, "");

  // Remove o DDI (+55) caso exista
  if (tel?.startsWith("55")) {
    tel = tel?.slice(2);
  }

  // Adiciona parênteses no DDD e traço no número
  tel = tel?.replace(/^(\d{2})(\d)/, "($1) $2");
  if (tel?.length === 13) {
    tel = tel?.replace(/(\d{4})(\d{4})$/, "$1-$2");
  } else if (tel?.length === 14) {
    tel = tel?.replace(/(\d{5})(\d{4})$/, "$1-$2");
  }

  return tel;
}
