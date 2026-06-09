import { Tag, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { type EntityType, roleLabelMap } from "../config-page.const";
import { formatCNPJ, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatRoleLabel } from "@/utils/role.util";

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
      ellipsis: { showTitle: false },
      render: (email: string) => {
        if (!email) return "-";
        return (
          <Tooltip placement="topLeft" title={email} overlayInnerStyle={{ fontSize: 12 }}>
            {email}
          </Tooltip>
        );
      },
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
      render: (company: { company_name: string }) => company?.company_name || "-",
      sorter: (a, b) => a.company?.company_name.localeCompare(b.company?.company_name || "") || 0,

    },

    {
      title: "Parceiro",
      dataIndex: "partner",
      key: "partner",
      width: 140,
      render: (partner: { partner_name: string }) => partner?.partner_name || "-",
      sorter: (a, b) => a.partner?.partner_name.localeCompare(b.partner?.partner_name || "") || 0,

    },
    {
      title: "Tipo",
      dataIndex: "user_type",
      key: "user_type",
      width: 140,
      render: (user_type: string) => user_type === "EQUIPE" ? "Equipe" : user_type === "SUBCREDENCIADO" ? "Subcredenciado" : "-",
      filters: [
        { text: "Equipe", value: "EQUIPE" },
        { text: "Subcredenciado", value: "SUBCREDENCIADO" },
      ],
      onFilter: (value, record) => record.user_type === value,

    },
    {
      title: "Responsável",
      dataIndex: "person_responsible",
      key: "person_responsible",
      width: 140,
      ellipsis: { showTitle: false },
      sorter: (a, b) => a.person_responsible?.user_name.localeCompare(b.person_responsible?.user_name),
      render: (person_responsible: { user_name: string }) => {
        if (!person_responsible) return "-";
        return (
          <Tooltip placement="topLeft" title={person_responsible?.user_name} overlayInnerStyle={{ fontSize: 12 }}>
            {person_responsible?.user_name}
          </Tooltip>
        );
      },
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
          {formatRoleLabel(role)}
        </Tag>
      ),
    },
  ];
}
