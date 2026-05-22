import { Col, Row, Button, Form, ConfigProvider, Input, Select, Tooltip, } from "antd";

import { OrderModalShell } from "../../common/components/order-modal-shell";
import { OrderModalSection } from "../../common/components/order-modal-section";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatBRL, formatPaymentMethod, formatPhoneNumber, organizeDateFormat } from "@/utils/number.utils";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatBrowserDisplay, formatDevice, formatOSDisplay, formatResolution, getAlertScenarios } from "@/utils/orders.util";
import { ExclamationOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useUpdateOrderStatusMutation } from "@/hooks/orders/useUpdateOrderStatusMutation";
import { EmpresasDisplay } from "../../common/components/companiesDisplay";
import type { OrderOperatorsAvailability } from "@/types/orders/base.type";
import { appSetting } from "@/constants/app-setting/config.const";
import anonymousAvatar from "@/assets/anonymous_avatar.png";
import { useUpdateEntity, type EntityType } from "../../config-page.const";
function resolveOperatorKey(companyName?: string | null) {
    return companyName?.split(" ")[0]?.toLowerCase().trim();
}

export const AvailabilityStatus = ({
    localData,
    companyName,
}: {
    localData: { operators_availability?: OrderOperatorsAvailability | null };
    companyName?: string | null;
}) => {
    const operatorKey = resolveOperatorKey(companyName);
    const operatorAvailability = operatorKey ? localData.operators_availability?.[operatorKey] : undefined;

    if (
        operatorAvailability?.available === null ||
        operatorAvailability?.available === undefined
    ) {
        return (
            <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center">-</div>
            </div>
        );
    }

    if (operatorAvailability.available) {
        if (operatorAvailability.found_via_range) {
            return (
                <div className="flex flex-col items-center mt-2">
                    <div className="flex items-center justify-center mb-2">
                        <Tooltip
                            title="Disponibilidade - Disponível (via range numérico)"
                            placement="top"
                            overlayStyle={{ fontSize: "12px" }}
                        >
                            <div className="h-2 w-2 bg-yellow-500 rounded-full cursor-pointer"></div>
                        </Tooltip>
                    </div>
                    <div className="text-center text-[11px] text-neutral-600 bg-yellow-50 px-2 py-1 rounded">
                        <strong>Range numérico:</strong> {operatorAvailability.range_min} - {" "}
                        {operatorAvailability.range_max}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center mt-2">
                    <div className="flex items-center justify-center">
                        <Tooltip
                            title="Disponibilidade - Disponível"
                            placement="top"
                            overlayStyle={{ fontSize: "12px" }}
                        >
                            <div className="h-2 w-2 bg-green-500 rounded-full cursor-pointer"></div>
                        </Tooltip>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
                <Tooltip
                    title="Disponibilidade - Indisponível"
                    placement="top"
                    overlayStyle={{ fontSize: "12px" }}
                >
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </Tooltip>
            </div>
        </div>
    );
};

export const PAPStatus = ({ localData }: { localData: { availability_pap?: boolean | number | null } }) => {
    if (
        localData.availability_pap === null ||
        localData.availability_pap === undefined
    ) {
        return (
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">-</div>
            </div>
        );
    }

    if (localData.availability_pap) {
        return (
            <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center">
                    <Tooltip
                        title="PAP - Disponível"
                        placement="top"
                        overlayStyle={{ fontSize: "12px" }}
                    >
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
                <Tooltip
                    title="PAP - Indisponível"
                    placement="top"
                    overlayStyle={{ fontSize: "12px" }}
                >
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </Tooltip>
            </div>
        </div>
    );
};

interface ViewModalProps {
    open: boolean;
    viewingEntity: EntityType | null;
    onClose: () => void;
    onEdit?: (entity: EntityType) => void;
    onDelete?: (entity: EntityType) => void;
    canDelete?: boolean;
}

export function ViewModal({
    open,
    viewingEntity,
    onClose,
    onEdit,
    onDelete,
    canDelete = false,
}: ViewModalProps) {
    const [observationForm] = Form.useForm();
    const updateMutation = useUpdateEntity();
    const statusMutation = useUpdateOrderStatusMutation();

    const [consultor, setConsultor] = useState("");
    const [idCRM, setIdCRM] = useState("");
    const [idCORP, setIdCORP] = useState("");
    const [credito, setCredito] = useState("");

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    useEffect(() => {
        if (open && viewingEntity) {
            observationForm.setFieldsValue({
                consultant: viewingEntity.responsible_consultant || "",
                crm_id: String(viewingEntity.crm_id || ""),
                corporate_id: viewingEntity.corporate_id || "",
                credit: String(viewingEntity.credit || ""),
                consultant_observation: viewingEntity.consultant_observation || "",
            });
        }
    }, [open, viewingEntity, observationForm]);

    if (!viewingEntity) {
        return null;
    }

    const resolvedCompanyName = viewingEntity.company ?? null;

    const handleSaveObservacao = async () => {
        const values = await observationForm.validateFields();
        if (values.consultant_observation?.trim() !== "") {
            updateMutation.mutate({
                id: viewingEntity!.id,
                payload: { consultant_observation: values.consultant_observation },
            });
        }
    };
    const color = appSetting.primaryColor;
    return (
        <OrderModalShell
            open={open}
            title={
                <>
                    <div className="flex flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
                        <span style={{ color: "#252525" }}>
                            Pedido Nº {viewingEntity?.order_number || viewingEntity?.id}
                        </span>
                        <div className="flex flex-col flex-wrap items-center gap-4 mr-6">
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Select: { hoverBorderColor: color, activeBorderColor: color, activeOutlineColor: "none" },
                                        Input: { hoverBorderColor: color, activeBorderColor: color },
                                    },
                                }}
                            >
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Consultor:</span>
                                        <Input size="small" placeholder="Consultor" style={{ width: 200 }} maxLength={13} value={consultor} onChange={(e) => setConsultor(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { responsible_consultant: consultor } })} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">ID CORP:</span>
                                        <Input size="small" placeholder="ID CORP" style={{ width: 110 }} maxLength={8} value={idCORP} onChange={(e) => setIdCORP(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { corporate_id: String(idCORP || "") } })} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">ID CRM:</span>
                                        <Input size="small" placeholder="ID CRM" style={{ width: 110 }} maxLength={8} value={idCRM} onChange={(e) => setIdCRM(e.target.value)} onPressEnter={() => updateMutation.mutate({ id: viewingEntity!.id, payload: { crm_id: Number(idCRM) } })} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Pedido:</span>
                                        <Select size="small" style={{ width: 110 }} value={viewingEntity?.status} onChange={(value) => statusMutation.mutate({ id: viewingEntity!.id, payload: { status: value } })} options={[{ value: "ABERTO", label: "Aberto" }, { value: "FECHADO", label: "Fechado" }, { value: "CANCELADO", label: "Cancelado" }]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Tramitação:</span>
                                        <Select placeholder="Selecione o status" size="small" value={viewingEntity?.after_sales_status} style={{ width: 280 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { after_sales_status: value } })} options={[]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Equipe:</span>
                                        <span className="font-normal text-[14px]">{viewingEntity?.team || "-"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Crédito:</span>
                                        <Input size="small" placeholder="Crédito" style={{ width: 110 }} maxLength={13} value={credito} onChange={(e) => setCredito(e.target.value)} onPressEnter={() => { const normalizedCredit = Number(String(credito ?? "").replace(/\s+/g, "").replace(",", ".")); updateMutation.mutate({ id: viewingEntity!.id, payload: { credit: Number.isNaN(normalizedCredit) ? 0 : normalizedCredit } }); }} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Atendimento:</span>
                                        <Select size="small" value={viewingEntity?.service} style={{ width: 180 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { service: value } })} options={[{ value: "em_andamento", label: "Em Andamento" }, { value: "concluido", label: "Concluído" }]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Instalação:</span>
                                        <span className="font-normal text-[14px]">{viewingEntity?.installation || "-"}</span>
                                    </div>
                                </div>
                            </ConfigProvider>
                        </div>
                    </div>
                </>
            }
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                        Editar
                    </Button>
                    <Button danger style={{ display: canDelete ? "inline-flex" : "none" }} onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                        Deletar
                    </Button>
                </div>
            }
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >
            <div className="max-h-100 overflow-y-auto scrollbar-thin">
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <OrderModalSection title="Detalhes do Plano">
                        <div className="mt-4 text-neutral-700">
                            <div className="flex items-center font-semibold text-[#666666] text-[14px]">
                                <p className="w-72 text-center">Plano</p>
                                <p className="w-50 text-center">Data de Instalação 1</p>
                                <p className="w-50 text-center">Data de Instalação 2</p>
                                <p className="w-32 text-center">Vencimento</p>
                                <p className="w-46 text-center">Total</p>
                                <p className="w-12 text-center">Extras</p>
                            </div>
                            <hr className="border-t border-neutral-300 mx-2" />
                            {viewingEntity && (
                                <React.Fragment key={viewingEntity.id}>
                                    <div className="flex items-center py-4 text-[14px] text-neutral-700 hover:bg-neutral-50 transition">
                                        <p className="text-[14px] font-semibold w-72 text-center">
                                            {viewingEntity.plan?.name
                                                ? `${viewingEntity.plan.name} - ${viewingEntity.price_summary?.plan_price != null ? formatBRL(viewingEntity.price_summary.plan_price) : "-"}`
                                                : "-"}
                                        </p>
                                        <p className="text-[14px] w-50 text-center">
                                            {viewingEntity.installation_preferred_date_one
                                                ? `${organizeDateFormat(viewingEntity.installation_preferred_date_one)} - ${viewingEntity.installation_preferred_period_one || "-"}`
                                                : "-"}
                                        </p>
                                        <p className="text-[14px] w-50 text-center">
                                            {viewingEntity.installation_preferred_date_two
                                                ? `${organizeDateFormat(viewingEntity.installation_preferred_date_two)} - ${viewingEntity.installation_preferred_period_two || "-"}`

                                                : "-"}
                                        </p>
                                        <p className="text-[14px] font-semibold w-32 text-center">{viewingEntity.due_day?.toString() || "-"}</p>
                                        <p className={`text-[14px] font-bold w-46 text-center text-${color}`}>
                                            {viewingEntity.price_summary?.total_monthly ? formatBRL(viewingEntity.price_summary.total_monthly) : "-"}
                                        </p>
                                        {viewingEntity.selected_extras && viewingEntity.selected_extras.length > 0 ? (
                                            <Tooltip title="Ver extras adicionados ao plano" placement="top">
                                                <button className={`w-12 text-center text-${color} font-bold focus:outline-none`} onClick={() => toggleExpand(String(viewingEntity.id))} aria-label="Expandir extras" type="button">
                                                    {expanded[viewingEntity.id] ? "−" : "+"}
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <button className={`w-12 text-center text-${color} font-bold focus:outline-none`} type="button" disabled aria-label="Sem extras" />
                                        )}
                                    </div>
                                    {expanded[viewingEntity.id] && viewingEntity.selected_extras && viewingEntity.selected_extras.length > 0 && (
                                        <div className="bg-neutral-50 px-8 py-2">
                                            <div className="font-semibold text-[#666666] text-[14px] mb-1">Extras adicionados</div>
                                            <ul className="divide-y divide-neutral-100">
                                                {viewingEntity.selected_extras.map((extra: any) => {
                                                    const opt = extra.options && extra.options[0] ? extra.options[0] : undefined;
                                                    return (
                                                        <li key={extra.id} className="flex justify-between items-center py-2">
                                                            <div>
                                                                <div className="font-medium text-sm">{extra.label}</div>
                                                                <div className="text-xs text-neutral-600">{opt?.description || extra.description || ""}</div>
                                                                {((opt?.bonus && (opt.bonus.type || opt.bonus.speed || opt.bonus.description)) || (extra.bonus && (extra.bonus.type || extra.bonus.speed || extra.bonus.description))) && (
                                                                    <div className="text-xs text-green-700">
                                                                        {opt?.bonus?.type || extra.bonus?.type ? `Com ${extra.label}` : ""}
                                                                        {opt?.bonus?.speed || extra.bonus?.speed ? ` + ganhe ${opt?.bonus?.speed || extra.bonus?.speed}` : ""}
                                                                        {opt?.bonus?.description || extra.bonus?.description ? ` ${opt?.bonus?.description || extra.bonus?.description}` : ""}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="font-semibold text-sm">
                                                                {typeof opt?.price === "number" ? formatBRL(opt.price) : typeof extra.price === "number" ? formatBRL(extra.price) : "-"}
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                    <hr className="border-t border-neutral-300 mx-2" />
                                </React.Fragment>
                            )}
                        </div>
                    </OrderModalSection>

                    <OrderModalSection title="Disponibilidade">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div style={{ background: '#fff', borderRadius: 6, padding: 16, textAlign: 'center', border: '1px solid #f0f0f0' }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#555', marginBottom: 8 }}>Disponibilidade</p>
                                    <AvailabilityStatus localData={viewingEntity} companyName={resolvedCompanyName} />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ background: '#fff', borderRadius: 6, padding: 16, textAlign: 'center', border: '1px solid #f0f0f0' }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#555', marginBottom: 8 }}>PAP</p>
                                    <PAPStatus localData={viewingEntity} />
                                </div>
                            </Col>
                        </Row>
                    </OrderModalSection>



                    <OrderModalSection title="Informações do Cliente">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={viewingEntity?.whatsapp?.avatar || anonymousAvatar} style={{ width: 40, height: 40, borderRadius: '50%', outline: viewingEntity?.pf_temperature === 10 ? '2px solid #d63535' : 'none' }} />
                                        {viewingEntity?.pf_temperature === 10 && (
                                            <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 12 }}>🔥</span>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}><ReadonlyField label="Nome" value={viewingEntity?.full_name} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Nome (RFB)" value={viewingEntity?.rfb_name} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Gênero" value={viewingEntity?.rfb_gender === 'M' ? 'Masculino' : viewingEntity?.rfb_gender === 'F' ? 'Feminino' : '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="CPF" value={formatCPF(viewingEntity?.cpf || '') || '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Email" value={viewingEntity?.email} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Data de Nascimento" value={viewingEntity?.birth_date} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Data Nascimento (RFB)" value={viewingEntity?.rfb_birth_date} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Nome da Mãe" value={viewingEntity?.mother_full_name} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Nome Mãe (RFB)" value={viewingEntity?.rfb_mother_name} copyable /></Col>
                        </Row>
                    </OrderModalSection>
                    <OrderModalSection title="Informações de Pagamento">
                        <Row gutter={[16, 16]}>
                            <Col span={12}><ReadonlyField label="Método de Pagamento" value={formatPaymentMethod(viewingEntity?.payment_method)} /></Col>
                            <Col span={12}><ReadonlyField label="Nome do Banco" value={viewingEntity?.bank_name || '-'} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Agência" value={viewingEntity?.bank_branch || '-'} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Número da Conta" value={viewingEntity?.bank_account_number || '-'} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Titular da Conta" value={viewingEntity?.bank_account_holder_name || '-'} copyable /></Col>
                            <Col span={12}><ReadonlyField label="CPF do Titular" value={formatCPF(viewingEntity?.bank_account_holder_cpf || '') || '-'} copyable /></Col>
                        </Row>
                    </OrderModalSection>
                    <OrderModalSection title="Contato">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 8 }}>Telefone Principal</p>
                                <Row gutter={[8, 8]}>
                                    <Col span={24}><ReadonlyField label="Número" value={formatPhoneNumber(viewingEntity?.phone || '')} copyable /></Col>
                                    <Col span={12}><ReadonlyField label="Anatel" value={viewingEntity?.phone_valid ? 'Sim' : viewingEntity?.phone_valid == null ? '-' : 'Não'} /></Col>
                                    <Col span={12}><ReadonlyField label="Operadora" value={viewingEntity?.operator} /></Col>
                                    <Col span={12}><ReadonlyField label="Portado" value={viewingEntity?.portability} /></Col>
                                    <Col span={12}><ReadonlyField label="Data da Portabilidade" value={viewingEntity?.portability_date || '-'} /></Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 8 }}>Telefone Adicional</p>
                                <Row gutter={[8, 8]}>
                                    <Col span={24}><ReadonlyField label="Número" value={formatPhoneNumber(viewingEntity?.additional_phone || '')} copyable /></Col>
                                    <Col span={12}><ReadonlyField label="Anatel" value={viewingEntity?.additional_phone_valid ? 'Sim' : viewingEntity?.additional_phone_valid == null ? '-' : 'Não'} /></Col>
                                    <Col span={12}><ReadonlyField label="Operadora" value={viewingEntity?.additional_operator} /></Col>
                                    <Col span={12}><ReadonlyField label="Portado" value={viewingEntity?.additional_portability} /></Col>
                                    <Col span={12}><ReadonlyField label="Data da Portabilidade" value={viewingEntity?.additional_portability_date || '-'} /></Col>
                                </Row>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Informações Empresariais">
                        <Row gutter={[16, 16]}>
                            <Col span={8}><ReadonlyField label="Sócio" value={viewingEntity?.is_socio ? 'Sim' : 'Não'} /></Col>
                            <Col span={8}><ReadonlyField label="MEI" value={viewingEntity?.is_mei ? 'Sim' : 'Não'} /></Col>
                            <Col span={12}><EmpresasDisplay empresas={viewingEntity?.company_partners} /></Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Endereço">
                        <Row gutter={[16, 16]}>
                            <Col span={12}><ReadonlyField label="Rua" value={viewingEntity?.address || '-'} copyable /></Col>
                            <Col span={6}><ReadonlyField label="Número" value={viewingEntity?.address_number || '-'} copyable /></Col>
                            <Col span={6}>
                                <ReadonlyField
                                    label="Complemento"
                                    value={
                                        viewingEntity?.address_complement?.building_or_house === 'house'
                                            ? viewingEntity?.address_complement?.home_complement || '-'
                                            : viewingEntity?.address_complement?.building_or_house === 'building'
                                                ? `${viewingEntity?.address_complement?.unit_type || '-'} ${viewingEntity?.address_complement?.unit_number || '-'}`
                                                : '-'
                                    }
                                    copyable
                                />
                            </Col>
                            <Col span={8}><ReadonlyField label="Bairro" value={viewingEntity?.district || '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Cidade" value={viewingEntity?.city || '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="UF" value={viewingEntity?.state || '-'} copyable /></Col>
                            <Col span={6}><ReadonlyField label="CEP" value={formatCEP(viewingEntity?.zip_code || '')} copyable /></Col>
                            <Col span={6}><ReadonlyField label="CEP Único" value={viewingEntity?.single_zip_code ? 'Sim' : 'Não'} /></Col>
                            <Col span={6}><ReadonlyField label="Quadra" value={viewingEntity?.address_complement?.square || '-'} copyable /></Col>
                            <Col span={6}><ReadonlyField label="Lote" value={viewingEntity?.address_complement?.lot || '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Tipo" value={viewingEntity?.address_complement?.building_or_house === 'building' ? 'Edifício' : 'Casa'} /></Col>
                            <Col span={8}><ReadonlyField label="Andar" value={viewingEntity?.address_complement?.floor || '-'} copyable /></Col>
                            <Col span={8}><ReadonlyField label="Ponto de Referência" value={viewingEntity?.address_complement?.reference_point || '-'} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Coordenadas" value={viewingEntity?.geolocation?.latitude && viewingEntity?.geolocation?.longitude ? `${viewingEntity?.geolocation.latitude}, ${viewingEntity?.geolocation.longitude}` : '-'} /></Col>
                            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <a href={viewingEntity?.geolocation?.maps_link} target="_blank" rel="noopener noreferrer" style={{ color: color }}>
                                    Ver no Google Maps
                                </a>
                            </Col>
                            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <a href={viewingEntity?.geolocation?.street_view_link} target="_blank" rel="noopener noreferrer" style={{ color: color }}>
                                    Ver no Street View
                                </a>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Dados do Tráfego">
                        <Row gutter={[16, 16]}>
                            <Col span={12}><ReadonlyField label="IP" value={viewingEntity?.client_ip} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Provedor" value={viewingEntity?.ip_isp} /></Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Tipo de Acesso"
                                    value={{ movel: 'Móvel', fixo: 'Fixo', hosting: 'Hosting', proxy: 'Proxy', local: 'Local', desconhecido: 'Desconhecido' }[viewingEntity?.ip_access_type || ""] ?? '-'}
                                    copyable
                                />
                            </Col>
                            <Col span={12}><ReadonlyField label="URL" value={viewingEntity?.url} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Plataforma" value={formatOSDisplay(viewingEntity?.fingerprint?.os)} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Dispositivo" value={formatDevice(viewingEntity?.fingerprint?.device || '-')} copyable /></Col>
                            <Col span={12}><ReadonlyField label="Browser" value={formatBrowserDisplay(viewingEntity?.fingerprint?.browser)} copyable /></Col>
                            <Col span={12}>
                                <ReadonlyField label="TimeZone" value={`${viewingEntity?.fingerprint?.timezone} - ${viewingEntity?.fingerprint?.timezone_name}`} copyable />
                            </Col>
                            <Col span={12}><ReadonlyField label="Resolução" value={formatResolution(viewingEntity?.fingerprint?.resolution || '-')} copyable /></Col>
                            <Col span={12}><ReadonlyField label="ID Fingerprint" value={viewingEntity?.fingerprint_id || '-'} copyable /></Col>
                        </Row>
                    </OrderModalSection>
                </div>

                {(viewingEntity?.status === "FECHADO" || viewingEntity?.status === "fechado") &&
                    getAlertScenarios({ availability: viewingEntity?.availability ?? undefined, found_via_range: viewingEntity?.found_via_range, single_zip_code: viewingEntity?.single_zip_code, status: viewingEntity?.status }).map((scenario, idx) => (
                        <div key={idx} className="flex flex-col gap-2 mb-3 rounded-sm p-3 w-full" style={{ backgroundColor: scenario.color }}>
                            <div className="flex items-center">
                                <h2 className="text-[14px] font-semibold">
                                    <ExclamationOutlined />
                                    <ExclamationOutlined /> ALERTA
                                    <ExclamationOutlined />
                                    <ExclamationOutlined />
                                </h2>
                            </div>
                            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg min-h-12.5 p-3">
                                <div className="text-[14px] w-full text-neutral-700">{scenario.content}</div>
                            </div>
                        </div>
                    ))}

                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                hoverBorderColor: color,
                                activeBorderColor: color,
                                activeShadow: "none",
                                colorBorder: "#bfbfbf",
                                colorTextPlaceholder: "#666666",
                            },
                            Button: {
                                colorBorder: color,
                                colorText: color,
                                colorPrimary: color,
                                colorPrimaryHover: color,
                            },
                        },
                    }}
                >
                    <OrderModalSection title="Observação do Consultor">
                        <div className="flex flex-col justify-center bg-neutral-100 text-[14px] rounded-sm mt-2">

                            <Form form={observationForm} layout="vertical">
                                <div className="flex flex-col p-4 text-[14px] w-full text-neutral-700">
                                    <Form.Item name="consultant_observation" style={{ marginBottom: 8 }}>
                                        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} className="text-[16px] font-light text-[#353535] w-full" placeholder="Adicione aqui uma observação sobre esse pedido..." />
                                    </Form.Item>
                                    <Button className="self-end" loading={updateMutation.isPending} style={{ fontSize: "12px", height: "25px" }} onClick={handleSaveObservacao}>
                                        Salvar
                                    </Button>
                                </div>
                            </Form>
                        </div></OrderModalSection>
                </ConfigProvider>
            </div>
        </OrderModalShell>
    );
}
