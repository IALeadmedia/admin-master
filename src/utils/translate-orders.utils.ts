export function formatFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    status: "Status",
    phone: "Telefone",
    consultant: "Consultor",
    credit: "Crédito",
    plan: "Plano",
    selected_extras: "Extras selecionados",
    instalation: "Instalação",
    service: "Atendimento",
    cpf: "CPF",
    email: "E-mail",
    due_day: "Vencimento",
    installation: "Instalação",
    responsible_consultant: "Consultor responsável",
    crm_id: "ID CRM",
    corporate_id: "ID CORP",
    availability_crm: "Disponibilidade CRM",
    debt_with_operator: "Dívida com operadora",
    contract: "Contrato",
    biometrics: "Biometria",
    input_crm: "Entrada no CRM",
    price_summary: "Resumo de preços",
  };

  return labels[field] ?? field.replaceAll("_", " ");
}
