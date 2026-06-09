import { Col, Row, Tooltip, Alert } from "antd";
import { useState } from "react";
import { OrderModalSection } from "../../common/components/order-modal-section";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatBRL, formatPaymentMethod, formatPhoneNumber, organizeDateFormat } from "@/utils/number.utils";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatBrowserDisplay, formatDevice, formatOSDisplay, formatPeriodInstallation, formatResolution } from "@/utils/orders.util";
import { EmpresasDisplay } from "../../common/components/companiesDisplay";
import anonymousAvatar from "@/assets/anonymous_avatar.png";
import { type EntityType } from "../../config-page.const";
import React from "react";
import { AvailabilityStatus, PAPStatus } from "./view-modal";

type AlertScenario = { color: string; content: React.ReactNode };

function resolveAlertType(color: string): "error" | "warning" | "success" {
    if (color === "#ffeaea") return "error";
    if (color === "#fff6c7") return "warning";
    if (color === "#e6ffed") return "success";
    return "warning";
}

export function OrderDetailsTab({
    viewingEntity,
    isAdmin,
    companyName,
    partnerName,
    color,
    alertScenarios = [],
}: {
    viewingEntity: EntityType;
    isAdmin: boolean;
    companyName?: string;
    partnerName?: string;
    color?: string;
    alertScenarios?: AlertScenario[];
}) {
    const resolvedCompanyName = viewingEntity.company ?? null;
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin">


            {alertScenarios

                .map((scenario, idx) => (
                    <Alert
                        key={idx}
                        type={resolveAlertType(scenario.color)}
                        message={scenario.content}
                        showIcon
                        className="mb-2"
                    />
                ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isAdmin && (
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Empresa"
                                    value={viewingEntity.company_id
                                        ? (companyName ?? `#${viewingEntity.company_id}`)
                                        : "-"}
                                />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Parceiro"
                                    value={viewingEntity.partner_id
                                        ? (partnerName ?? `#${viewingEntity.partner_id}`)
                                        : "-"}
                                />
                            </Col>
                        </Row>
                    </div>
                )}

                <OrderModalSection title="Detalhes do Plano">
                    <div className="mt-4 text-neutral-700">
                        <div className="flex items-center font-semibold text-[#666666] text-[14px]">
                            <p className="w-72 text-center">Plano</p>
                            <p className="w-50 text-center">Data de Instalação 1</p>
                            <p className="w-50 text-center">Data de Instalação 2</p>
                            <p className="w-50 text-center">Data de Instalação 3</p>
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
                                        {viewingEntity.installation_preferred_date_one && viewingEntity.installation_preferred_date_one !== "Invalid Date"
                                            ? `${organizeDateFormat(viewingEntity.installation_preferred_date_one)} - ${formatPeriodInstallation(viewingEntity.installation_preferred_period_one || "")}`
                                            : "-"}
                                    </p>
                                    <p className="text-[14px] w-50 text-center">
                                        {viewingEntity.installation_preferred_date_two && viewingEntity.installation_preferred_date_two !== "Invalid Date"
                                            ? `${organizeDateFormat(viewingEntity.installation_preferred_date_two)} - ${formatPeriodInstallation(viewingEntity.installation_preferred_period_two || "")}`
                                            : "-"}
                                    </p>
                                    <p className="text-[14px] w-50 text-center">
                                        {viewingEntity.installation_preferred_date_three && viewingEntity.installation_preferred_date_three !== "Invalid Date"
                                            ? `${organizeDateFormat(viewingEntity.installation_preferred_date_three)} - ${formatPeriodInstallation(viewingEntity.installation_preferred_period_three || "")}`
                                            : "-"}
                                    </p>
                                    <p className="text-[14px] font-semibold w-32 text-center">{viewingEntity.due_day?.toString() || "-"}</p>
                                    <p className={`text-[14px] font-bold w-46 text-center text-${color}`}>
                                        {viewingEntity.price_summary?.total_monthly ? formatBRL(viewingEntity.price_summary.total_monthly) : "-"}
                                    </p>
                                    {viewingEntity.selected_extras && viewingEntity.selected_extras.length > 0 ? (
                                        <Tooltip title="Ver extras adicionados ao plano" placement="top">
                                            <button
                                                className={`w-12 text-center text-${color} font-bold focus:outline-none`}
                                                onClick={() => toggleExpand(String(viewingEntity.id))}
                                                aria-label="Expandir extras"
                                                type="button"
                                            >
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
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
        </div>
    );
}