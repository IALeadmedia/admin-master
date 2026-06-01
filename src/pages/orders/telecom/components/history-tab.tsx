import { useOrderLogsQuery } from "@/hooks/orders/useOrderLogsQuery";
import type { OrderLogItem } from "@/types/orders";
import { Empty, Tag, Timeline } from "antd";

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
}

function formatUserType(value: string): string {
    const labels: Record<string, string> = {
        admin: "Administrador",
        order_token: "Cliente",
    };

    return labels[value] ?? value;
}

function formatFieldLabel(field: string): string {
    const labels: Record<string, string> = {
        status: "Status",
        phone: "Telefone",
        consultant: "Consultor",
        credit: "Crédito",
    };

    return labels[field] ?? field.replaceAll("_", " ");
}

export function OrderHistoryTab({
    orderId,
}: {
    orderId: number;
}) {

    const { data, isLoading } = useOrderLogsQuery(orderId, "telecom", "tim");
    const logs = data?.logs ?? [];

    const renderLogChange = (log: OrderLogItem) =>
        Object.entries(log.changes).map(([field, change]) => (
            <div key={`${log.id}-${field}`} className="mt-2 rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700">
                <div className="mb-2 font-medium text-neutral-900">
                    {formatFieldLabel(field)} alterado
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-neutral-900">
                        {change.old ?? "-"}
                    </span>

                    <span className="text-neutral-400">→</span>

                    <span className="font-medium text-green-700">
                        {change.new ?? "-"}
                    </span>
                </div>
            </div>
        ));

    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-4">
            <div className="bg-neutral-100 rounded-sm p-3 w-full">
                {isLoading ? (
                    <div className="py-6 text-center text-sm text-neutral-500">
                        Carregando histórico...
                    </div>
                ) : logs.length === 0 ? (
                    <Empty description="Nenhuma alteração encontrada para este pedido." />
                ) : (
                    <Timeline
                        items={logs.map((log) => ({
                            children: (
                                <div className="pb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-neutral-900">
                                            {log.changed_by}
                                        </span>

                                        <Tag color="blue">
                                            {formatUserType(log.user_type)}
                                        </Tag>

                                        <span className="text-xs text-neutral-500">
                                            {formatDateTime(log.created_at)}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        {renderLogChange(log)}
                                    </div>
                                </div>
                            ),
                        }))}
                    />
                )}
            </div>
        </div>
    );
}