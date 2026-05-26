
import { Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCNPJ } from "@/utils/document.util";
import { formatCategoryLabel } from "@/utils/text.util";

export function getColumns(): TableColumnsType<EntityType> {
  return [
    {
      title: "Logo",
      dataIndex: "logo_url", key: "logo_url",
      width: 180,
      render: (logo_url: string) => (
        <div className="flex items-center justify-center w-full bg-gray-100 p-2  rounded-md">
          <div className="w-32 h-10 flex items-center justify-center ">
            <img
              src={logo_url}
              alt="Logo"
              className="max-h-10 max-w-32 w-auto h-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Nome",
      dataIndex: "partner_name",
      key: "partner_name",
      width: 160,
      sorter: (a, b) => a.partner_name.localeCompare(b.partner_name),
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      key: "cnpj",
      width: 140,
      render: (cnpj: string) => formatCNPJ(cnpj) || "-",

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
      width: 140,
      render: (telephone: string) => formatPhoneNumber(telephone) || "-"
    },
    {
      title: "Responsável",
      dataIndex: "manager_name",
      key: "manager_name",
      width: 160,
      ellipsis: { showTitle: false },
      sorter: (a, b) => a.manager_name.localeCompare(b.manager_name),
      render: (manager_name: string) => {
        if (!manager_name) return "-";
        return (
          <Tooltip placement="topLeft" title={manager_name} overlayInnerStyle={{ fontSize: 12 }}>
            {manager_name}
          </Tooltip>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: ["company", "company_name"],
      key: "company_name",
      width: 140,
      render: (company_name: string) => company_name || "-",
      sorter: (a, b) => a.company?.company_name.localeCompare(b.company?.company_name || "") || 0,
    },
    {
      title: "Tipo de Cliente",
      dataIndex: "client_type",
      key: "client_type",
      width: 140,
      render: (client_type: string[]) =>
        client_type?.length
        && client_type.join(", "),
      filters: [
        { text: "PJ", value: "PJ" },
        { text: "PF", value: "PF" },
        { text: "Ambos", value: "PF, PJ" },
      ],
      onFilter: (value, record) => {
        if (value === "PF, PJ") {
          return (
            record.client_type?.includes("PF") &&
            record.client_type?.includes("PJ")
          ) || false;
        }
        const other = value === "PF" ? "PJ" : "PF";
        return (
          record.client_type?.includes(value as string) &&
          !record.client_type?.includes(other)
        ) || false;
      },
    },
    {
      title: "UF",
      dataIndex: "uf",
      key: "uf",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (uf: string[]) => {
        if (!uf?.length) return null;
        const joined = uf.join(", ");
        return (
          <Tooltip
            placement="topLeft"
            title={joined}
            overlayStyle={{ fontSize: "12px" }}
          >
            {joined}
          </Tooltip>
        );
      },
    },
    {
      title: "Categorias",
      dataIndex: "category",
      key: "category",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (category: string[]) => {
        if (!category?.length) return null;

        const joined = category.map(formatCategoryLabel).join(", ");

        return (
          <Tooltip placement="topLeft" title={joined} overlayStyle={{ fontSize: "12px" }}>
            {joined}
          </Tooltip>
        );
      },
    },
  ];
}
