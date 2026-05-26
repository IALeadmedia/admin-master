import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions, ContentColumns } from "pdfmake/interfaces";
import type { FinanceOrder, TelecomOrder } from "@/types/orders";
import { formatCEP, formatCPF } from "@/utils/document.util";
import {
  formatBRL,
  formatPaymentMethod,
  formatPhoneNumber,
  organizeDateFormat,
} from "@/utils/number.utils";
(pdfMake as any).vfs = (pdfFonts as any).vfs;

type OrderPdfEntity = FinanceOrder | TelecomOrder;

interface GenerateOrderPdfOptions {
  order: OrderPdfEntity;
  segmentLabel: string;
  partnerName?: string | null;
  companyName?: string | null;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? normalized : "-";
  }
  return String(value);
}

function yesNoUnknown(value: boolean | number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value ? "Sim" : "Nao";
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  return organizeDateFormat(value);
}

function buildAddressComplement(order: OrderPdfEntity): string {
  const complement = order.address_complement;
  const buildingOrHouse = complement?.building_or_house;

  if (buildingOrHouse === "house") {
    return toText(complement?.home_complement);
  }

  if (buildingOrHouse === "building") {
    const unitType = toText(complement?.unit_type);
    const unitNumber = toText(complement?.unit_number);
    if (unitType === "-" && unitNumber === "-") return "-";
    return `${unitType} ${unitNumber}`.trim();
  }

  return "-";
}

function buildSectionTitle(title: string) {
  return { text: title, style: "sectionHeader" };
}

function buildBulletList(lines: string[]) {
  return {
    ul: lines,
    style: "content",
  };
}

type ExtraOptionLike = {
  description?: string;
  price?: number;
};

type ExtraLike = {
  label?: string;
  description?: string;
  price?: number;
  options?: ExtraOptionLike[];
};

export async function generateOrderPdf({
  order,
  segmentLabel,
  partnerName,
  companyName,
}: GenerateOrderPdfOptions): Promise<void> {
  const isTelecomOrder = "plan" in order;
  const telecomOrder = isTelecomOrder ? (order as TelecomOrder) : null;
  const financeOrder = !isTelecomOrder ? (order as FinanceOrder) : null;
  const sectionTypeLabel = telecomOrder ? "Banda Larga" : "Financas";

  const planName = telecomOrder?.plan?.name ?? "-";
  const planValue = formatBRL(
    telecomOrder?.price_summary?.plan_price ?? telecomOrder?.plan?.value,
  );
  const totalMonthly = formatBRL(telecomOrder?.price_summary?.total_monthly);
  const telecomExtras = Array.isArray(telecomOrder?.selected_extras)
    ? (telecomOrder.selected_extras as unknown as ExtraLike[])
    : [];

  const productsOfInterest = Array.isArray(financeOrder?.products_of_interest)
    ? financeOrder?.products_of_interest.join(", ")
    : toText(financeOrder?.products_of_interest);

  const companyPartnerBlock: ContentColumns = {
    columns: [
      {
        width: "*",
        stack: [
          //   { text: "Empresa", style: "miniTitle" },
          {
            text: `${toText(companyName ?? order.company)} - ${toText(partnerName)}`,
            style: "miniText",
          },
        ],
        margin: [0, 0, 12, 0],
      },
      //   {
      //     width: "*",
      //     stack: [
      //       { text: "Parceiro", style: "miniTitle" },
      //       { text: toText(partnerName), style: "miniText" },
      //     ],
      //   },
    ],
    margin: [0, 2, 0, 10] as [number, number, number, number],
  };

  const productSection = telecomOrder
    ? [
        buildSectionTitle("Plano"),
        {
          table: {
            headerRows: 1,
            widths: ["*", 100, 100, 80],
            body: [
              [
                { text: "Plano", style: "tableHeader" },
                { text: "Valor Mensal", style: "tableHeader" },
                { text: "Total Mensal", style: "tableHeader" },
                { text: "Vencimento", style: "tableHeader" },
              ],
              [
                { text: planName, style: "tableBody" },
                { text: planValue, style: "tableBody" },
                { text: totalMonthly, style: "tableBody" },
                { text: toText(telecomOrder.due_day), style: "tableBody" },
              ],
            ],
          },
          layout: "lightHorizontalLines",
          style: "productTable",
        },

        ...(telecomExtras.length
          ? [
              buildSectionTitle("Extras do Plano"),
              {
                table: {
                  headerRows: 1,
                  widths: ["*", 170, 80],
                  body: [
                    [
                      { text: "Extra", style: "tableHeader" },
                      { text: "Descricao", style: "tableHeader" },
                      { text: "Valor", style: "tableHeader" },
                    ],
                    ...telecomExtras.map((extra) => {
                      const firstOption = extra.options?.[0];
                      const resolvedPrice =
                        typeof firstOption?.price === "number"
                          ? firstOption.price
                          : extra.price;

                      return [
                        { text: toText(extra.label), style: "tableBody" },
                        {
                          text: toText(
                            firstOption?.description ?? extra.description,
                          ),
                          style: "tableBody",
                        },
                        {
                          text:
                            typeof resolvedPrice === "number"
                              ? formatBRL(resolvedPrice)
                              : "-",
                          style: "tableBody",
                        },
                      ];
                    }),
                  ],
                },
                layout: "lightHorizontalLines",
                style: "productTable",
              },
            ]
          : []),
        buildBulletList([
          `Possui Disponibilidade: ${yesNoUnknown(telecomOrder.availability)}`,
          `Possui Disponibilidade PAP: ${yesNoUnknown(telecomOrder.availability_pap)}`,
        ]),
      ]
    : [
        buildSectionTitle("Produtos de Interesse"),
        buildBulletList([
          `Produto Principal: ${toText(financeOrder?.landing_page)}`,
          `Outros Produtos: ${productsOfInterest}`,
        ]),
      ];

  const installationSection = telecomOrder
    ? [
        buildSectionTitle("Preferencias de Instalacao"),
        buildBulletList([
          `Data de Instalação 1: ${formatDate(telecomOrder.installation_preferred_date_one)} - ${toText(telecomOrder.installation_preferred_period_one)}`,
          `Data de Instalação 2: ${formatDate(telecomOrder.installation_preferred_date_two)} - ${toText(telecomOrder.installation_preferred_period_two)}`,
          `Data de Instalação 3: ${formatDate(telecomOrder.installation_preferred_date_three)} - ${toText(telecomOrder.installation_preferred_period_three)}`,
        ]),
      ]
    : [];

  const documentDefinition: TDocumentDefinitions = {
    pageMargins: [20, 40, 20, 40] as [number, number, number, number],
    content: [
      {
        text: `Pedido ${sectionTypeLabel} N ${order.order_number ?? order.id}`,
        style: "title",
      },
      companyPartnerBlock,
      buildSectionTitle("Resumo do Pedido"),
      buildBulletList([
        `Status: ${toText(order.status)}`,
        `Tramitacao: ${toText(order.after_sales_status)}`,
        `Equipe: ${toText(order.team)}`,
        `Consultor Responsavel: ${toText(order.responsible_consultant)}`,
        `Atendimento: ${toText(order.service)}`,
      ]),
      ...productSection,
      buildSectionTitle("Informacoes do Cliente"),
      buildBulletList([
        `Nome: ${toText(order.full_name)}`,
        `CPF: ${formatCPF(order.cpf || "") || "-"}`,
        `Email: ${toText(order.email)}`,
        `Telefone Principal: ${formatPhoneNumber(order.phone || "") || "-"}`,
        `Telefone Adicional: ${formatPhoneNumber(order.additional_phone || "") || "-"}`,
        `Data de Nascimento: ${toText(order.birth_date)}`,
        `Nome da Mae: ${toText(order.mother_full_name)}`,
      ]),
      buildSectionTitle("Endereco"),
      buildBulletList([
        `CEP: ${formatCEP(order.zip_code || "") || "-"}`,
        `Rua: ${toText(order.address)}`,
        `Numero: ${toText(order.address_number)}`,
        `Complemento: ${buildAddressComplement(order)}`,
        `Lote: ${toText(order.address_complement?.lot)}`,
        `Quadra: ${toText(order.address_complement?.square)}`,
        `Andar: ${toText(order.address_complement?.floor)}`,
        `Bairro: ${toText(order.district)}`,
        `Cidade: ${toText(order.city)}`,
        `UF: ${toText(order.state)}`,
        `CEP Unico: ${yesNoUnknown(order.single_zip_code)}`,
      ]),
      ...installationSection,
      buildSectionTitle("Pagamento"),
      buildBulletList([
        `Metodo: ${formatPaymentMethod(order.payment_method)}`,
        `Banco: ${toText(order.bank_name)}`,
        `Agencia: ${toText(order.bank_branch)}`,
        `Conta: ${toText(order.bank_account_number)}`,
        `Titular: ${toText(order.bank_account_holder_name)}`,
        `CPF do Titular: ${formatCPF(order.bank_account_holder_cpf || "") || "-"}`,
      ]),
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "#222222",
        fillColor: "#f3f3f3",
        margin: [0, 4, 0, 4] as [number, number, number, number],
      },
      tableBody: {
        fontSize: 9,
        color: "#444444",
        margin: [0, 2, 0, 2] as [number, number, number, number],
      },
      productTable: {
        margin: [0, 5, 0, 15] as [number, number, number, number],
      },
      title: {
        fontSize: 18,
        bold: true,
        color: "#333333",
        margin: [0, 0, 0, 12] as [number, number, number, number],
        alignment: "center" as const,
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#444444",
        margin: [0, 15, 0, 8] as [number, number, number, number],
      },
      content: {
        fontSize: 11,
        color: "#555555",
        margin: [0, 0, 0, 3] as [number, number, number, number],
        lineHeight: 1.25,
      },
      miniTitle: {
        fontSize: 10,
        bold: true,
        color: "#606060",
      },
      miniText: {
        fontSize: 11,
        color: "#2f2f2f",
      },
      footer: {
        alignment: "center" as const,
        italics: true,
        fontSize: 11,
        color: "#333333",
      },
    },
  };

  pdfMake
    .createPdf(documentDefinition)
    .download(
      `pedido-${segmentLabel.toLowerCase()}-${order.order_number ?? order.id}.pdf`,
    );
}
