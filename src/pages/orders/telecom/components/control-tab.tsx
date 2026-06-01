import { Row, Col, Select } from "antd";

export function OrderControlTab({
    viewingEntity,
    updateMutation,
}: {
    viewingEntity: any;
    updateMutation: any;
}) {
    return (
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin p-2 flex flex-col gap-6">

            {/* ===================== */}
            {/* CONTROLE COMERCIAL */}
            {/* ===================== */}
            <div className="border rounded-md p-4 bg-white">
                <div className="font-semibold mb-4 text-neutral-700">
                    Controle Comercial
                </div>

                <Row gutter={[16, 16]}>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Consultor</div>
                        <Select
                            value={viewingEntity?.responsible_consultant || undefined}
                            style={{ width: "100%" }}
                            placeholder="Selecionar"
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: {
                                        responsible_consultant: value,
                                    },
                                })
                            }
                            options={[
                                { value: "Carlos Silva", label: "Carlos Silva" },
                                { value: "Maria Souza", label: "Maria Souza" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">ID CRM</div>
                        <Select
                            value={viewingEntity?.crm_id || undefined}
                            style={{ width: "100%" }}
                            placeholder="ID CRM"
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { crm_id: value },
                                })
                            }
                            options={[
                                { value: 1001, label: "1001" },
                                { value: 1002, label: "1002" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">ID CORP</div>
                        <Select
                            value={viewingEntity?.corporate_id || undefined}
                            style={{ width: "100%" }}
                            placeholder="ID CORP"
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { corporate_id: value },
                                })
                            }
                            options={[
                                { value: "A123", label: "A123" },
                                { value: "B456", label: "B456" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Crédito</div>
                        <Select
                            value={viewingEntity?.credit ?? undefined}
                            style={{ width: "100%" }}
                            placeholder="Crédito"
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { credit: value },
                                })
                            }
                            options={[
                                { value: 0, label: "0" },
                                { value: 50, label: "50" },
                                { value: 100, label: "100" },
                            ]}
                        />
                    </Col>

                </Row>
            </div>

            {/* ===================== */}
            {/* VALIDAÇÕES */}
            {/* ===================== */}
            <div className="border rounded-md p-4 bg-white">
                <div className="font-semibold mb-4 text-neutral-700">
                    Validações
                </div>

                <Row gutter={[16, 16]}>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Input CRM</div>
                        <Select
                            value={viewingEntity?.input_crm ?? undefined}
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { input_crm: value },
                                })
                            }
                            options={[
                                { value: true, label: "Sim" },
                                { value: false, label: "Não" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Disponibilidade CRM</div>
                        <Select
                            value={viewingEntity?.availability_crm ?? undefined}
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { availability_crm: value },
                                })
                            }
                            options={[
                                { value: "sim", label: "Sim" },
                                { value: "nao", label: "Não" },
                                { value: "sem_analise", label: "Sem análise" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Débito Operadora</div>
                        <Select
                            value={viewingEntity?.debt_with_operator ?? undefined}
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { debt_with_operator: value },
                                })
                            }
                            options={[
                                { value: "sim", label: "Sim" },
                                { value: "nao", label: "Não" },
                                { value: "sem_analise", label: "Sem análise" },
                            ]}
                        />
                    </Col>

                </Row>
            </div>

            {/* ===================== */}
            {/* FORMALIZAÇÃO */}
            {/* ===================== */}
            <div className="border rounded-md p-4 bg-white">
                <div className="font-semibold mb-4 text-neutral-700">
                    Formalização
                </div>

                <Row gutter={[16, 16]}>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Contrato</div>
                        <Select
                            value={viewingEntity?.contract ?? undefined}
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { contract: value },
                                })
                            }
                            options={[
                                { value: "nao_enviado", label: "Não enviado" },
                                { value: "aguardando", label: "Aguardando" },
                                { value: "assinado", label: "Assinado" },
                                { value: "cancelado", label: "Cancelado" },
                            ]}
                        />
                    </Col>

                    <Col span={6}>
                        <div className="text-xs text-neutral-500 mb-1">Biometria</div>
                        <Select
                            value={viewingEntity?.biometrics ?? undefined}
                            onChange={(value) =>
                                updateMutation.mutate({
                                    id: viewingEntity.id,
                                    payload: { biometrics: value },
                                })
                            }
                            options={[
                                { value: "nao_enviada", label: "Não enviada" },
                                { value: "aguardando", label: "Aguardando" },
                                { value: "realizado", label: "Realizado" },
                                { value: "cancelado", label: "Cancelado" },
                            ]}
                        />
                    </Col>

                </Row>
            </div>

        </div>
    );
}