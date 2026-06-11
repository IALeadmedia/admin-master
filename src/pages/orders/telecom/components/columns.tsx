import { Tooltip, type TableColumnsType } from "antd";
import {
    getSharedOrderColumnsAfter,
    getSharedOrderColumnsBefore,
} from "../../common/components/columns";
import { DollarSign } from "lucide-react";
import type { ICompany } from "@/types/ICompany.type";
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
const OPERATOR_ASSETS: Record<string, { src: string; className: string }> = {
    claro: { src: "/claro.png", className: "h-8 w-8" },
    tim: { src: "/tim.svg", className: "h-9" },
    oi: { src: "/oi.svg", className: "h-8" },
    sky: { src: "/sky.svg", className: "h-6" },
    nio: { src: "/nio.svg", className: "h-3" },
    algar: { src: "/algar.png", className: "h-5" },
    brisanet: { src: "/brisanet.png", className: "h-4" },
    vero: { src: "/vero.svg", className: "h-4" },

};
function resolveOperatorKey(companyName?: string | null) {
    return companyName?.split(" ")[0]?.toLowerCase().trim();
}

function getAvailabilityColumns(companies: ICompany[] = []): TableColumnsType<TelecomOrder> {
    const vivoColumn: TableColumnsType<TelecomOrder>[number] = {
        title: (
            <div className="flex items-center justify-center">
                <img src="/vivo.png" alt="Vivo" />
            </div>
        ),
        width: 80,
        render: (_, record) => renderAvailability(record.availability, record.found_via_range),
    };

    const otherColumns: TableColumnsType<TelecomOrder> = companies
        .filter((company) => company.company_name !== "Vivo")
        .map((company) => {
            const operatorKey = resolveOperatorKey(company.company_name);
            const asset = operatorKey ? OPERATOR_ASSETS[operatorKey] : undefined;

            return {
                title: (
                    <div className="flex items-center justify-center">
                        {asset ? (
                            <img src={asset.src} alt={company.company_name} className={asset.className} />
                        ) : (
                            <span className="text-xs">{company.company_name}</span>
                        )}
                    </div>
                ),
                width: 100,
                render: (_: unknown, record: TelecomOrder) => {
                    const companyAvailability = operatorKey
                        ? record.operators_availability?.[operatorKey]
                        : undefined;

                    return renderAvailability(
                        companyAvailability?.available ?? null,
                        companyAvailability?.found_via_range ?? null,
                    );
                },
            };
        });

    return [...otherColumns, vivoColumn];
}

type UseAllTableColumnsProps = {
    columns?: TableColumnsType<TelecomOrder>;
    companies?: ICompany[];
};

function getSingleAvailabilityColumn(companies: ICompany[]): TableColumnsType<TelecomOrder>[number] {
    return {
        title: "Disponibilidade",
        width: 120,
        render: (_, record) => {
            const companyName = companies.find(
                (company) => company.company_id === record.company_id,
            )?.company_name;
            const operatorKey = resolveOperatorKey(companyName);
            const companyAvailability = operatorKey
                ? record.operators_availability?.[operatorKey]
                : undefined;

            return renderAvailability(
                companyAvailability?.available ?? null,
                companyAvailability?.found_via_range ?? null,
            );
        },
    };
}

function getTelecomSpecificColumns(companies: ICompany[] = [], isAdmin = false): TableColumnsType<TelecomOrder> {
    return [
        ...(isAdmin ? getAvailabilityColumns(companies) : [getSingleAvailabilityColumn(companies)]),
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
            title: "Velocidade",
            dataIndex: ["plan", "speed"],
            width: 120,
            render: (speed) => (speed ? speed : "-"),
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

function getTelecomOrderColumns(companies: ICompany[] = [], isAdmin = false): TableColumnsType<TelecomOrder> {
    return [
        ...getSharedOrderColumnsBefore<TelecomOrder>(),
        ...getTelecomSpecificColumns(companies, isAdmin),
        ...getSharedOrderColumnsAfter<TelecomOrder>(),
    ];
}

export function getAllTableColumns({
    columns,
    companies,
}: UseAllTableColumnsProps = {}): TableColumnsType<TelecomOrder> {
    if (columns?.length) {
        return columns;
    }

    return getTelecomOrderColumns(companies);
}

export const useAllTableColumns = getAllTableColumns;

export function getColumns(companies: ICompany[] = [], isAdmin = false): TableColumnsType<TelecomOrder> {
    return getTelecomOrderColumns(companies, isAdmin);
}

function resolveAvailabilityLabel(
    available: boolean | number | null | undefined,
    foundViaRange?: boolean | null,
    rangeMin?: number | null,
    rangeMax?: number | null,
): string {
    if (available === null || available === undefined) return "-";
    if (!available) return "Indisponível";
    if (foundViaRange) {
        const range =
            rangeMin != null && rangeMax != null
                ? `: ${rangeMin}-${rangeMax}`
                : "";
        return `Disponível (via range numérico${range})`;
    }
    return "Disponível";
}

export function getAvailabilityExportColumns(
    companies: ICompany[],
): Array<{ title: string; getValue: (record: unknown) => string }> {
    const otherCols = companies
        .filter((c) => c.company_name !== "Vivo")
        .map((company) => {
            const operatorKey = resolveOperatorKey(company.company_name);
            return {
                title: company.company_name,
                getValue: (record: unknown) => {
                    const r = record as TelecomOrder;
                    const avail = operatorKey
                        ? r.operators_availability?.[operatorKey]
                        : undefined;
                    return resolveAvailabilityLabel(
                        avail?.availability ?? avail?.available ?? null,
                        avail?.encontrado_via_range ?? avail?.found_via_range ?? null,
                        avail?.range_min ?? null,
                        avail?.range_max ?? null,
                    );
                },
            };
        });

    const vivoCol = {
        title: "Vivo",
        getValue: (record: unknown) => {
            const r = record as TelecomOrder;
            return resolveAvailabilityLabel(r.availability, r.found_via_range);
        },
    };

    return [...otherCols, vivoCol];
}