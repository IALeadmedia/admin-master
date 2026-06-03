import { appSetting } from "@/constants/app-setting/config.const";
import { Row, Col, Select, Input, ConfigProvider, Typography } from "antd";
import { useState } from "react";
import { OrderModalSection } from "../../common/components/order-modal-section";

export function OrderControlTab({
    viewingEntity,
    updateMutation,
}: {
    viewingEntity: any;
    updateMutation: any;
}) {

    const [consultor, setConsultor] = useState("");
    const [idCRM, setIdCRM] = useState("");
    const [idCORP, setIdCORP] = useState("");
    const [credito, setCredito] = useState("");


    const color = appSetting.primaryColor;
    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-4 ">
            <ConfigProvider
                theme={{
                    components: {
                        Select: { hoverBorderColor: color, activeBorderColor: color, activeOutlineColor: "none" },
                        Input: { hoverBorderColor: color, activeBorderColor: color },
                    },
                }}
            >

                <OrderModalSection title="Informações Gerais">
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Consultor</Typography.Text>
                                <Input size="small" style={{ width: 200 }} maxLength={13} value={consultor} onChange={(e) => setConsultor(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { responsible_consultant: consultor } })} />
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">ID CORP</Typography.Text>
                                <Input size="small" style={{ width: 160 }} maxLength={8} value={idCORP} onChange={(e) => setIdCORP(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { corporate_id: String(idCORP || "") } })} />
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Equipe</Typography.Text>
                                <Select size="small" value={viewingEntity?.team} style={{ width: 200 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { team: value } })} options={[]} />
                            </span>
                        </Col>
                    </Row>
                </OrderModalSection>


                <OrderModalSection title="CRM">

                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">ID CRM</Typography.Text>
                                <Input size="small" style={{ width: 160 }} maxLength={8} value={idCRM} onChange={(e) => setIdCRM(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { crm_id: Number(idCRM) } })} />
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Input CRM</Typography.Text>
                                <Select
                                    size="small"
                                    style={{ width: 160 }}
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
                                /></span>
                        </Col>

                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Disponibilidade CRM</Typography.Text>
                                <Select
                                    size="small"
                                    style={{ width: 160 }}
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
                                /></span>
                        </Col>


                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Formalização e Análise">
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Crédito</Typography.Text>

                                <Input size="small" style={{ width: 160 }} maxLength={13} value={credito} onChange={(e) => setCredito(e.target.value)} onPressEnter={() => { const normalizedCredit = Number(String(credito ?? "").replace(/\s+/g, "").replace(",", ".")); updateMutation.mutate({ id: viewingEntity!.id, payload: { credit: Number.isNaN(normalizedCredit) ? 0 : normalizedCredit } }); }} />
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Débito Operadora</Typography.Text>

                                <Select
                                    size="small"
                                    style={{ width: 160 }}
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
                                /></span>
                        </Col>
                        <Col span={6} >

                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Contrato</Typography.Text>

                                <Select
                                    size="small"
                                    style={{ width: 160 }}
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
                            </span>
                        </Col>

                        <Col span={6}>
                            <span className="flex flex-col gap-1">
                                <Typography.Text type="secondary">Biometria</Typography.Text>

                                <Select
                                    size="small"
                                    style={{ width: 160 }}
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
                                /></span>
                        </Col>

                    </Row>
                </OrderModalSection>
            </ConfigProvider>
        </div>
    );
}