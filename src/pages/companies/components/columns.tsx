
import { Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCNPJ } from "@/utils/document.util";
import { formatCategoryLabel } from "@/utils/text.util";

export function getColumns(): TableColumnsType<EntityType> {
    return [
        {
            title: "Segmento",
            dataIndex: "segment",
            width: 120,
            key: "segment",
            render: (segment: string) => segment === "telecom" ? "Telecom" : segment === "finances" ? "Financeiro" : segment === "benefits" ? "Benefícios" : "-",
            filters: [
                { text: "Telecom", value: "telecom" },
                { text: "Financeiro", value: "finances" },
                { text: "Benefícios", value: "benefits" },
            ],
            onFilter: (value, record) => record.segment === value,

        },
        {
            title: "Nome",
            dataIndex: "company_name",
            key: "company_name",
            width: 200,
            sorter: (a, b) => a.company_name.localeCompare(b.company_name),
        },
        {
            title: "CNPJ",
            dataIndex: "cnpj",
            key: "cnpj",
            width: 140,
            render: (cnpj: string) => formatCNPJ(cnpj) || "-",
            filters: [
                {
                    text: "Preenchido",
                    value: "preenchido",
                },
                {
                    text: "Vazio",
                    value: "vazio",
                },
            ],
            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return (
                        record.cnpj !== null && record.cnpj !== undefined && record.cnpj !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.cnpj === null || record.cnpj === undefined || record.cnpj === ""
                    );
                }
                return true;
            },

        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 140,
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
            key: "respmanager_nameonsible",
            width: 140,
            render: (responsible: string) => responsible || "-"
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
