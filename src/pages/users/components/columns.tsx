import { Tag } from "antd";
import type { TableColumnsType } from "antd";
import { type EntityType, roleLabelMap } from "../config-page.const";
import { formatCNPJ, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";

export function getColumns(): TableColumnsType<EntityType> {
  return [
    {
      title: "Nome",
      dataIndex: "user_name",
      key: "user_name",
      width: 160,
      sorter: (a: EntityType, b: EntityType) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      render: (email: string) => email || "-"
    },
    {
      title: "Telefone",
      dataIndex: "telephone",
      key: "telephone",
      width: 120,
      render: (telephone: string) => formatPhoneNumber(telephone) || "-"
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      width: 120,
      render: (cpf: string) => formatCPF(cpf) || "-"
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      key: "cnpj",
      width: 140,
      render: (cnpj: string) => formatCNPJ(cnpj) || "-"
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      width: 140,
      render: (company: { company_name: string }) => company?.company_name || "-"
    },

    {
      title: "Parceiro",
      dataIndex: "partner",
      key: "partner",
      width: 140,
      render: (partner: { partner_name: string }) => partner?.partner_name || "-"
    },
    {
      title: "Tipo",
      dataIndex: "user_type",
      key: "user_type",
      width: 140,
      render: (user_type: string) => user_type === "EQUIPE" ? "Equipe" : user_type === "SUBCREDENCIADO" ? "Subcredenciado" : "-"
    },
    {
      title: "Responsável",
      dataIndex: "person_responsible",
      key: "person_responsible",
      width: 140,
      render: (person_responsible: { user_name: string }) => person_responsible?.user_name || "-"
    },
    {
      title: "Nível de Acesso",
      dataIndex: "role",
      key: "role",
      width: 140,
      filters: Object.entries(roleLabelMap).map(([value, text]) => ({ text, value })),
      onFilter: (value, record: EntityType) =>
        (typeof value === "string" || typeof value === "number") && record.role === value,
      render: (role: EntityType["role"]) => (
        <Tag color={role === "ADMIN" ? "magenta" : "gray"}>
          {roleLabelMap[role]}
        </Tag>
      ),
    },
  ];
}
