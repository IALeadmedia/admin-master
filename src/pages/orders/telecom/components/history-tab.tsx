import { Timeline, Tag } from "antd";

export function OrderHistoryTab({
    orderId,
}: {
    orderId: number;
}) {
    const mockHistory = [
        {
            id: 1,
            user_name: "Sistema",
            created_at: "01/06/2026 08:15",
            action: "Pedido criado",
            description:
                "Cliente iniciou o preenchimento do formulário.",
        },
        {
            id: 2,
            user_name: "Carlos Silva",
            created_at: "01/06/2026 09:02",
            action: "Status alterado",
            old_value: "ABERTO",
            new_value: "EM ANDAMENTO",
        },
        {
            id: 3,
            user_name: "Carlos Silva",
            created_at: "01/06/2026 09:10",
            action: "Consultor alterado",
            old_value: "Não definido",
            new_value: "Carlos Silva",
        },
        {
            id: 4,
            user_name: "Carlos Silva",
            created_at: "01/06/2026 09:18",
            action: "Crédito atualizado",
            old_value: "R$ 50,00",
            new_value: "R$ 100,00",
        },
        {
            id: 5,
            user_name: "Maria Souza",
            created_at: "01/06/2026 09:45",
            action: "Status alterado",
            old_value: "EM ANDAMENTO",
            new_value: "FECHADO",
        },
    ];

    console.log(orderId);

    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin px-2">
            <Timeline
                reverse
                items={mockHistory.map((log) => ({
                    children: (
                        <div className="pb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {log.user_name}
                                </span>

                                <span className="text-xs text-neutral-500">
                                    {log.created_at}
                                </span>
                            </div>

                            <div className="mt-2">
                                <Tag color="blue">
                                    {log.action}
                                </Tag>
                            </div>

                            {log.description && (
                                <div className="mt-2 text-sm text-neutral-700">
                                    {log.description}
                                </div>
                            )}

                            {log.old_value && log.new_value && (
                                <div className="mt-2 text-sm text-neutral-700">
                                    <span className="font-medium">
                                        {log.old_value}
                                    </span>

                                    <span className="mx-2 text-neutral-400">
                                        →
                                    </span>

                                    <span className="font-medium text-green-700">
                                        {log.new_value}
                                    </span>
                                </div>
                            )}
                        </div>
                    ),
                }))}
            />
        </div>
    );
}