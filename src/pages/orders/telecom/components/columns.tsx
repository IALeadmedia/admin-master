import { Tooltip, type TableColumnsType } from "antd";
import {
    getSharedOrderColumnsAfter,
    getSharedOrderColumnsBefore,
} from "../../common/components/columns";
import { DollarSign } from "lucide-react";
import type { TelecomOrder } from "@/types/orders/telecom.type";
function renderBoolDot(value: boolean | null | undefined, trueTitle: string, falseTitle: string) {
    if (value === null || value === undefined) {
        return "-";
    }

    return value ? (
        <div className="flex items-center justify-center ">
            <Tooltip placement="top" overlayInnerStyle={{ fontSize: 12 }} title={trueTitle}>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </Tooltip>
        </div>
    ) : (
        <div className="flex items-center justify-center ">
            <Tooltip placement="top" overlayInnerStyle={{ fontSize: 12 }} title={falseTitle}>
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            </Tooltip>
        </div>
    );
}


function renderAvailability(value: boolean | number | null | undefined, foundViaRange?: boolean | null) {
    if (value === null || value === undefined) return "-";

    return value ? (
        foundViaRange ? (
            <div className="flex items-center justify-center ">
                <Tooltip
                    title="Disponível (via range numérico)"
                    placement="top"
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                </Tooltip>
            </div>
        ) : (
            <div className="flex items-center justify-center ">
                <Tooltip title="Disponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </Tooltip>
            </div>
        )
    ) : (
        <div className="flex items-center justify-center ">
            <Tooltip title="Indisponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            </Tooltip>
        </div>
    );
}
type UseAllTableColumnsProps = {
    columns?: TableColumnsType<TelecomOrder>;
};

function getTelecomSpecificColumns(): TableColumnsType<TelecomOrder> {
    return [

        {
            title: "Disponibilidade",
            dataIndex: ["operators_availability", "tim"],
            width: 120,
            render: (timAvailability) =>
                timAvailability?.available ? (
                    timAvailability?.found_via_range ? (
                        <div className="flex items-center justify-center ">
                            <Tooltip
                                title="Disponível (via range numérico)"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center ">
                            <Tooltip title="Disponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip title="Indisponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        </Tooltip>
                    </div>
                ),
        },

        {
            title: "Plano",
            dataIndex: ["plan", "name"],
            ellipsis: { showTitle: false },
            render: (_, record) => (
                <Tooltip placement="topLeft" title={record.plan?.name} overlayInnerStyle={{ fontSize: 12 }}>
                    {record.plan?.name ? record.plan.name : "-"}
                </Tooltip>
            ),
            width: 180,
        },
        {
            title: "Valor do Plano",
            dataIndex: ["plan", "value"],
            width: 120,
            render: (_, record) => (record.plan?.value ? `R$ ${record.plan.value}` : "-"),
        },
        {
            title: "Vencimento",
            dataIndex: "due_day",
            width: 120,
            render: (due_day) => (due_day ? String(due_day) : "-"),
        },

        {
            title: "PAP",
            dataIndex: "availability_pap",
            width: 80,
            render: (availability, record) => renderAvailability(availability, record.found_via_range),
        },
        {
            title: "Instalação",
            dataIndex: "installation",
            width: 110,
            render: (installation) => installation || "-",
        },
        {
            title: "Débito",
            dataIndex: "debit",
            width: 80,
            render: (debit) => renderBoolDot(debit, "Possui débito", "Não possui débito"),
        },
        {
            title: "Crédito",
            dataIndex: "credit",
            width: 80,
            render: (credit) => {
                if (credit === null || credit === undefined) {
                    return "-";
                }

                return credit ? (
                    <div className="flex items-center justify-center ">
                        <Tooltip placement="top" overlayInnerStyle={{ fontSize: 12 }} title="Possui crédito">
                            <div className="bg-green-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                                <DollarSign size={15} />
                            </div>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip placement="top" overlayInnerStyle={{ fontSize: 12 }} title="Não possui crédito">
                            <div className="bg-red-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                                <DollarSign size={15} />
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
}

function getTelecomOrderColumns(): TableColumnsType<TelecomOrder> {
    return [
        ...getSharedOrderColumnsBefore<TelecomOrder>(),
        ...getTelecomSpecificColumns(),
        ...getSharedOrderColumnsAfter<TelecomOrder>(),
    ];
}

export function getAllTableColumns({
    columns,
}: UseAllTableColumnsProps = {}): TableColumnsType<TelecomOrder> {
    if (columns?.length) {
        return columns;
    }

    return getTelecomOrderColumns();
}

export const useAllTableColumns = getAllTableColumns;

export function getColumns(): TableColumnsType<TelecomOrder> {
    return getTelecomOrderColumns();
}
