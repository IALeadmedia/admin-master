import { Card, Tag } from "antd";

type TranshipmentEntity = {
    previous_order_ids?: number[];
    journey?: string[];
    transhipment?: boolean;
};

function formatOperatorName(operator: string) {
    if (!operator) {
        return "Operadora";
    }

    return operator
        .replace(/[_-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function TranshipmentTab({
    viewingEntity,
}: {
    viewingEntity: TranshipmentEntity;
}) {
    const previousOrderIds = viewingEntity?.previous_order_ids ?? [];
    const journey = viewingEntity?.journey ?? [];
    const hasTranshipment = viewingEntity?.transhipment

    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-4">
            <Card className="w-full">
                {!hasTranshipment ? (
                    <div className="text-sm text-neutral-500">
                        Cliente novo. Não há pedidos anteriores nem trajetória de transbordo registrada.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <section className="flex flex-col gap-3">
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-800">
                                    Pedidos anteriores
                                </h4>
                                <p className="text-xs text-neutral-500">
                                    {previousOrderIds.length === 0
                                        ? "Nenhum pedido anterior encontrado."
                                        : `Este cliente passou por ${previousOrderIds.length} pedido(s) antes do atual.`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {previousOrderIds.length > 0 ? (
                                    previousOrderIds.map((previousOrderId) => (
                                        <Tag key={previousOrderId} color="blue">
                                            Pedido #{previousOrderId}
                                        </Tag>
                                    ))
                                ) : (
                                    <Tag color="default">Sem transbordo anterior</Tag>
                                )}
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-800">
                                    Trajetória de operadoras
                                </h4>

                            </div>

                            {journey.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {journey.map((operator, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === journey.length - 1;

                                        return (
                                            <Card
                                                key={`${operator}-${index}`}
                                                size="small"
                                                className="border-neutral-200"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs uppercase tracking-wide text-neutral-500">
                                                            Etapa {index + 1}
                                                        </span>
                                                        <span>
                                                            Operadora: <strong className="text-base text-neutral-800">  {formatOperatorName(operator)}
                                                            </strong></span>
                                                    </div>

                                                    <Tag color={isFirst ? "green" : isLast ? "gold" : "processing"}>
                                                        {isFirst ? "Entrada" : isLast ? "Destino final" : "Intermediária"}
                                                    </Tag>
                                                </div>


                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-neutral-500">
                                    Nenhuma trajetória de operadoras registrada.
                                </div>
                            )}
                        </section>
                    </div>
                )
                }
            </Card >
        </div >
    );
}