import { type TableColumnsType } from "antd";
import {
    getSharedOrderColumnsAfter,
    getSharedOrderColumnsBefore,
} from "../../common/components/columns";
import type { BenefitsOrder } from "@/types/orders/benefits.type";

type UseAllTableColumnsProps = {
    columns?: TableColumnsType<BenefitsOrder>;
};

type BenefitsOrderRecord = BenefitsOrder & {
    pf_temperature?: number | null;
    landing_page?: string | null;
};

function getBenefitsHeaderColumns(): TableColumnsType<BenefitsOrderRecord> {
    return [

        {
            title: "Produto",
            dataIndex: "category",
            width: 160,
            render: (category) =>
                category === "vale-refeicao"
                    ? "Vale Refeição"
                    : category === "vale-alimentacao"
                        ? "Vale Alimentação"
                        : category === "vale-auto"
                            ? "Vale Auto"
                            : "-",
        },
        {
            title: "Objetivo do Contato",
            dataIndex: "contact_objective",
            width: 180,
            render: (contact_objective) => {
                return contact_objective === "rh_contratar_vr" ? "Sou RH/Empregador e quero contratar a VR na minha empresa" :
                    contact_objective === "estabelecimento_aceitar_vr" ? "Sou Estabelecimento e quero aceitar VR" :
                        contact_objective === "cliente_mais_info" ? "Já sou cliente VR e quero mais informações" :
                            contact_objective === "trabalhador_consultar_saldo" ? "Sou Trabalhador e quero consultar meu saldo VR" :
                                "-";
            }
        },
        {
            title: "Número de Colaboradores",
            dataIndex: "company_size_range",
            width: 160,
            render: (company_size_range) =>
                company_size_range === "1_a_10"
                    ? "1 a 10"
                    : company_size_range === "11_a_25"
                        ? "11 a 25"
                        : company_size_range === "26_a_50"
                            ? "26 a 50"
                            : company_size_range === "51_a_100"
                                ? "51 a 100"
                                : company_size_range === "101_a_999"
                                    ? "101 a 999"
                                    : company_size_range === "mais_de_1000"
                                        ? "Mais de 1000"
                                        : "-",
        },

    ];
}

export function getBenefitsOrderColumns(): TableColumnsType<BenefitsOrderRecord> {
    return [
        ...getSharedOrderColumnsBefore<BenefitsOrderRecord>(),
        ...getBenefitsHeaderColumns(),
        ...getSharedOrderColumnsAfter<BenefitsOrderRecord>(),
    ];
}

export function useAllTableColumns({
    columns,
}: UseAllTableColumnsProps = {}): TableColumnsType<BenefitsOrderRecord> {
    if (columns?.length) {
        return columns;
    }

    return getBenefitsOrderColumns();
}
