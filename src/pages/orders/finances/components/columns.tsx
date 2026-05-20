import { type TableColumnsType } from "antd";
import type { FinanceOrderType } from "../config-page.const";
import {
    getSharedOrderColumnsAfter,
    getSharedOrderColumnsBefore,
} from "../../common/components/columns";
import { formatBRL } from "@/utils/number.utils";

type UseAllTableColumnsProps = {
    columns?: TableColumnsType<FinanceOrderType>;
};

type FinanceOrderRecord = FinanceOrderType & {
    pf_temperature?: number | null;
    products_of_interest?: string | string[] | null;
    landing_page?: string | null;
    price_summary?: { total_monthly?: number | null } | null;
};

function getFinanceHeaderColumns(): TableColumnsType<FinanceOrderRecord> {
    return [

        {
            title: "Produto Principal",
            dataIndex: "landing_page",
            width: 160,
            render: (landing_page) =>
                landing_page === "conta-pj"
                    ? "Conta PJ"
                    : landing_page === "cartao-pj-c6"
                        ? "Cartão PJ"
                        : landing_page === "maquininha-c6-empresas"
                            ? "Maquininha"
                            : "-",
        },
        {
            title: "Outros Produtos",
            dataIndex: "products_of_interest",
            width: 180,
            render: (products_of_interest) => {
                if (!products_of_interest) return "-";

                const labelMap: Record<string, string> = {
                    "conta-pj": "Conta PJ",
                    "capital-giro-c6": "Capital de Giro",
                    maquininha: "Maquininha",
                    investimentos: "Investimentos",
                    "cartao-credito": "Cartão de Crédito",
                    "reducao-dividas": "Redução de Dívidas",
                    outro: "Outro",
                };

                const values = Array.isArray(products_of_interest)
                    ? products_of_interest
                    : [products_of_interest];

                return values.map((item) => labelMap[item] ?? item).join(", ");
            },
        },
        {
            title: "Total",
            dataIndex: ["price_summary", "total_monthly"],
            width: 120,
            render: (_, record) =>
                record.price_summary?.total_monthly != null
                    ? formatBRL(record.price_summary.total_monthly)
                    : "-",
        },
    ];
}

export function getFinanceOrderColumns(): TableColumnsType<FinanceOrderRecord> {
    return [
        ...getSharedOrderColumnsBefore<FinanceOrderRecord>(),
        ...getFinanceHeaderColumns(),
        ...getSharedOrderColumnsAfter<FinanceOrderRecord>(),
    ];
}

export function useAllTableColumns({
    columns,
}: UseAllTableColumnsProps = {}): TableColumnsType<FinanceOrderRecord> {
    if (columns?.length) {
        return columns;
    }

    return getFinanceOrderColumns();
}
