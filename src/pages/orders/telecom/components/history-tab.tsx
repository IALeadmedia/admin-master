import { useOrderLogsQuery } from "@/hooks/orders/useOrderLogsQuery";
import type { OrderLogItem } from "@/types/orders";
import { organizeDateFormat } from "@/utils/number.utils";
import { formatRoleLabel } from "@/utils/role.util";
import { formatFieldLabel } from "@/utils/translate-orders.utils";
import { Empty, Tag, Timeline } from "antd";

function formatLogValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return "[]";
        }

        return value.map(formatLogValue).join(", ");
    }

    if (typeof value === "object") {
        const record = value as Record<string, unknown>;

        if (typeof record.name === "string") {
            const parts = [record.name];

            if (typeof record.speed === "string" && record.speed.trim()) {
                parts.push(record.speed);
            }

            if (typeof record.value === "number") {
                parts.push(String(record.value));
            }

            return parts.join(" - ");
        }

        if (typeof record.label === "string") {
            return record.label;
        }

        if (typeof record.id === "string" || typeof record.id === "number") {
            return `#${record.id}`;
        }
        return Object.entries(record)
            .map(
                ([key, entryValue]) =>
                    `${formatFieldLabel(key)}: ${formatLogValue(entryValue)}`
            )
            .join(" | ");
    }

    return String(value);
}

export function OrderHistoryTab({
    orderId,
}: {
    orderId: number;
}) {

    const { data, isLoading } = useOrderLogsQuery(orderId, "telecom");
    const logs = data?.logs ?? [];

    const renderLogChange = (log: OrderLogItem) =>
        Object.entries(log.changes).map(([field, change]) => (
            <div key={`${log.id}-${field}`} className="mt-2 rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700">
                <div className="mb-2 font-medium text-neutral-900">
                    {formatFieldLabel(field)} alterado
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-neutral-900">
                        {formatLogValue(change.old)}
                    </span>

                    <span className="text-neutral-400">→</span>

                    <span className="font-medium text-green-700">
                        {formatLogValue(change.new)}
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
                                            {formatRoleLabel(log.user_type)}
                                        </Tag>

                                        <span className="text-xs text-neutral-500">
                                            {organizeDateFormat(log.created_at)}
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