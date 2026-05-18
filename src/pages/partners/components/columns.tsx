
import { Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCNPJ } from "@/utils/document.util";

export function getColumns(): TableColumnsType<EntityType> {
  return [
    {
      title: "Logo",
      dataIndex: "logo_url", key: "logo_url",
      width: 160,
      render: (logo_url: string) => <div className="flex items-center text-center justify-center">
        <img src={logo_url} alt="Logo" className="h-8  " />
      </div>
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
      render: (cnpj: string) => formatCNPJ(cnpj) || "-"
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
      width: 140,
      render: (telephone: string) => formatPhoneNumber(telephone) || "-"
    },
    {
      title: "Responsável",
      dataIndex: "manager_name",
      key: "manager_name",
      width: 140,
      render: (manager_name: string) => manager_name || "-"
    },
    {
      title: "Empresa",
      dataIndex: ["company", "company_name"],
      key: "company_name",
      width: 140,
      render: (company_name: string) => company_name || "-"
    },
    {
      title: "Tipo de Cliente",
      dataIndex: "client_type",
      key: "client_type",
      width: 140,
      render: (client_type: string[]) =>
        client_type?.length
        && client_type.join(", ")

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
  ];
}
