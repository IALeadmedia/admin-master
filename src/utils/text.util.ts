export function summarizeName(fullName?: string | null): string {
  if (!fullName?.trim()) return "";

  const names = fullName.trim().split(" ");
  const validNames = names.filter((name) => name.length > 0);

  if (validNames.length === 0) return "";

  const firstLetter = validNames[0][0].toUpperCase();

  if (validNames.length === 1) {
    const singleName = validNames[0];
    const secondLetter =
      singleName.length > 1 ? singleName[1].toUpperCase() : "";
    return firstLetter + secondLetter;
  }

  const lastLetter = validNames[validNames.length - 1][0].toUpperCase();
  return firstLetter + lastLetter;
}
const categoryLabelMap: Record<string, string> = {
  "banda-larga": "Banda Larga",
  "telefonia-movel": "Telefonia Móvel",
  "maquinha-cartao": "Maquininha",
};

export function formatCategoryLabel(category: string) {
  return categoryLabelMap[category] ?? category;
}
