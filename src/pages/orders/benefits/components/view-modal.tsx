import { App, Button, Col, ConfigProvider, Form, Input, Row, Select } from "antd";
import { useEffect, useState, } from "react";
import { OrderModalSection } from "../../common/components/order-modal-section";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatBrowserDisplay, formatDevice, formatOSDisplay, formatResolution } from "@/utils/orders.util";
import { useUpdateEntity } from "../../config-page.const";
import type { BenefitsOrder, } from "@/types/orders";
import anonymousAvatar from "@/assets/anonymous_avatar.png";
import { EmpresasDisplay } from "../../common/components/companiesDisplay";
import { appSetting, isAdminDomain } from "@/constants/app-setting/config.const";
import { useUpdateOrderStatusMutation } from "@/hooks/orders/useUpdateOrderStatusMutation";
import { useAuth } from "@/context/auth-provider";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { generateOrderPdf } from "@/utils/order-pdf.util";

interface ViewModalProps {
    open: boolean;
    viewingEntity: BenefitsOrder | null;
    onClose: () => void;
    onEdit?: (entity: BenefitsOrder) => void;
    onDelete?: (entity: BenefitsOrder) => void;
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
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const updateMutation = useUpdateEntity(); const statusMutation = useUpdateOrderStatusMutation();
    const [consultor, setConsultor] = useState("");
    const [idCRM, setIdCRM] = useState("");
    const [idCORP, setIdCORP] = useState("");
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const { isGlobalAdmin } = useAuth();
    const isAdmin = isAdminDomain && isGlobalAdmin;

    const { data: partnerData } = usePartnerQuery({
        partnerId: viewingEntity?.partner_id ?? undefined,
        enabled: isAdmin && !!viewingEntity?.partner_id,
    });
    const selectedPartner = partnerData?.partners?.find(
        (p) => p.partner_id === viewingEntity?.partner_id,
    );
    const partnerName = selectedPartner?.partner_name;

    const { data: companyData } = useCompanyQuery({
        per_page: 100,
        enabled: isAdmin && !!viewingEntity?.company_id,
    });
    const selectedCompany = companyData?.companies.find(
        (c) => c.company_id === viewingEntity?.company_id,
    );
    const companyName = selectedCompany?.company_name;

    const benefitsData = viewingEntity;

    useEffect(() => {
        if (open && benefitsData) {
            form.setFieldsValue({
                consultant_observation: benefitsData.consultant_observation || "",
            });
        }
    }, [benefitsData, form, open]);



    const handleSaveObservacao = async () => {
        const values = await form.validateFields();
        if (values.consultant_observation?.trim() !== "" && benefitsData) {
            updateMutation.mutate({
                id: benefitsData.id,
                payload: { consultant_observation: values.consultant_observation },
            });
        }
    };

    const handleExportPdf = async () => {
        if (!benefitsData) return;

        setIsExportingPdf(true);
        try {
            await generateOrderPdf({
                order: benefitsData,
                segmentLabel: "beneficios",
                companyName,
                partnerName,
            });
        } catch {
            message.error("Nao foi possivel exportar o PDF do pedido.");
        } finally {
            setIsExportingPdf(false);
        }
    };

    const produtoPrincipal =
        benefitsData?.category === "vale-refeicao"
            ? "Vale Refeição"
            : benefitsData?.category === "vale-alimentacao"
                ? "Vale Alimentação"
                : benefitsData?.category === "vale-auto"
                    ? "Vale Auto"
                    : "-";

    const contactObjectiveLabel = (() => {
        if (!benefitsData?.contact_objective) return "-";
        return benefitsData.contact_objective === "rh_contratar_vr" ? "Sou RH/Empregador e quero contratar a VR na minha empresa" :
            benefitsData.contact_objective === "estabelecimento_aceitar_vr" ? "Sou Estabelecimento e quero aceitar VR" :
                benefitsData.contact_objective === "cliente_mais_info" ? "Já sou cliente VR e quero mais informações" :
                    benefitsData.contact_objective === "trabalhador_consultar_saldo" ? "Sou Trabalhador e quero consultar meu saldo VR" :
                        "-";
    })();



    const numberOfEmployees = (() => {
        if (!benefitsData?.company_size_range) return "-";
        return benefitsData?.company_size_range === "1_a_10"
            ? "1 a 10"
            : benefitsData?.company_size_range === "11_a_25"
                ? "11 a 25"
                : benefitsData?.company_size_range === "26_a_50"
                    ? "26 a 50"
                    : benefitsData?.company_size_range === "51_a_100"
                        ? "51 a 100"
                        : benefitsData?.company_size_range === "101_a_999"
                            ? "101 a 999"
                            : benefitsData?.company_size_range === "mais_de_1000"
                                ? "Mais de 1000"
                                : "-";
    })();

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

                                </div>
                                <div className="flex flex-wrap gap-4">

                                    <div className="flex gap-2">
                                        <span className="text-[14px] font-semibold">Atendimento:</span>
                                        <Select size="small" value={viewingEntity?.service} style={{ width: 180 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { service: value } })} options={[{ value: "em_andamento", label: "Em Andamento" }, { value: "concluido", label: "Concluído" }]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Equipe:</span>
                                        <span className="font-normal text-[14px]">{viewingEntity?.team || "-"}</span>
                                    </div>
                                </div>
                            </ConfigProvider>
                        </div>
                    </div>
                </>
            }
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button onClick={handleExportPdf} loading={isExportingPdf}>
                        Exportar PDF
                    </Button>
                    <Button type="primary" onClick={() => benefitsData && onEdit?.(benefitsData)}>
                        Editar
                    </Button>
                    {canDelete && (
                        <Button danger onClick={() => benefitsData && onDelete?.(benefitsData)}>
                            Deletar
                        </Button>
                    )}
                </div>
            }
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >  <div className="max-h-100 overflow-y-auto scrollbar-thin">
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {isAdmin && (
                        <OrderModalSection title="">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <ReadonlyField
                                        label="Empresa"
                                        value={benefitsData?.company_id
                                            ? (companyName ?? `#${benefitsData.company_id}`)
                                            : "-"}
                                    />
                                </Col>
                                {/* <Col span={12}>
                                    <ReadonlyField
                                        label="Parceiro"
                                        value={benefitsData?.partner_id
                                            ? (partnerName ?? `#${benefitsData.partner_id}`)
                                            : "-"}
                                    />
                                </Col> */}
                            </Row>
                        </OrderModalSection>
                    )}
                    <OrderModalSection title="Produtos de Interesse">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ReadonlyField label="Produto" value={produtoPrincipal} />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Objetivo de Contato" value={contactObjectiveLabel} />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Número de Colaboradores" value={numberOfEmployees} />
                            </Col>
                        </Row>
                    </OrderModalSection>



                    <OrderModalSection title="Informações do Cliente">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                    <div style={{ position: "relative" }}>
                                        <img
                                            src={benefitsData?.whatsapp?.avatar || anonymousAvatar}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                outline: benefitsData?.pf_temperature === 10 ? "2px solid #d63535" : "none",
                                            }}
                                        />
                                        {benefitsData?.pf_temperature === 10 && (
                                            <span style={{ position: "absolute", top: -4, right: -4, fontSize: 12 }}>🔥</span>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Nome" value={benefitsData?.full_name} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Nome (RFB)" value={benefitsData?.rfb_name} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="CPF" value={formatCPF(benefitsData?.cpf || "")} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField
                                    label="Gênero (RFB)"
                                    value={benefitsData?.rfb_gender === "M" ? "Masculino" : benefitsData?.rfb_gender === "F" ? "Feminino" : "-"}
                                />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="Data Nascimento (RFB)" value={benefitsData?.rfb_birth_date} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Nome Mãe (RFB)" value={benefitsData?.rfb_mother_name} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Email" value={benefitsData?.email} copyable />
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Contato">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8 }}>Telefone Principal</p>
                                <Row gutter={[8, 8]}>
                                    <Col span={24}>
                                        <ReadonlyField label="Número" value={formatPhoneNumber(benefitsData?.phone || "")} copyable />
                                    </Col>
                                    <Col span={12}>
                                        <ReadonlyField
                                            label="Anatel"
                                            value={benefitsData?.phone_valid == null ? "-" : benefitsData.phone_valid ? "Sim" : "Não"}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <ReadonlyField label="Portado" value={benefitsData?.portability} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Informações Empresariais">
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <ReadonlyField label="Sócio" value={benefitsData?.is_socio ? "Sim" : "Não"} />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="MEI" value={benefitsData?.is_mei ? "Sim" : "Não"} />
                            </Col>
                            <Col span={12}>
                                <EmpresasDisplay empresas={benefitsData?.company_partners} />
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Endereço">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ReadonlyField label="Rua" value={benefitsData?.address || "-"} copyable />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField label="Número" value={benefitsData?.address_number || "-"} copyable />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField
                                    label="Complemento"
                                    value={
                                        benefitsData?.address_complement?.building_or_house === "house"
                                            ? benefitsData?.address_complement?.home_complement || "-"
                                            : benefitsData?.address_complement?.building_or_house === "building"
                                                ? `${benefitsData?.address_complement?.unit_type || "-"} ${benefitsData?.address_complement?.unit_number || "-"}`
                                                : "-"
                                    }
                                    copyable
                                />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="Bairro" value={benefitsData?.district || "-"} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="Cidade" value={benefitsData?.city || "-"} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="UF" value={benefitsData?.state || "-"} copyable />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField label="CEP" value={formatCEP(benefitsData?.zip_code || "")} copyable />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField label="CEP Único" value={benefitsData?.single_zip_code ? "Sim" : "Não"} />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField label="Quadra" value={benefitsData?.address_complement?.square || "-"} copyable />
                            </Col>
                            <Col span={6}>
                                <ReadonlyField label="Lote" value={benefitsData?.address_complement?.lot || "-"} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField
                                    label="Tipo"
                                    value={benefitsData?.address_complement?.building_or_house === "building" ? "Edifício" : "Casa"}
                                />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="Andar" value={benefitsData?.address_complement?.floor || "-"} copyable />
                            </Col>
                            <Col span={8}>
                                <ReadonlyField label="Ponto de Referência" value={benefitsData?.address_complement?.reference_point || "-"} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Coordenadas"
                                    value={
                                        benefitsData?.geolocation?.latitude && benefitsData?.geolocation?.longitude
                                            ? `${benefitsData.geolocation.latitude}, ${benefitsData.geolocation.longitude}`
                                            : "-"
                                    }
                                />
                            </Col>
                            <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                                <a href={benefitsData?.geolocation?.maps_link} target="_blank" rel="noopener noreferrer" style={{ color: "#242424", textDecoration: "underline" }}>
                                    Ver no Google Maps
                                </a>
                            </Col>
                            <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                                <a href={benefitsData?.geolocation?.street_view_link} target="_blank" rel="noopener noreferrer" style={{ color: "#242424", textDecoration: "underline" }}>
                                    Ver no Street View
                                </a>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Dados do Tráfego">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ReadonlyField label="IP" value={benefitsData?.client_ip} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Provedor" value={benefitsData?.ip_isp} />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Tipo de Acesso"
                                    value={(() => {
                                        const accessTypeMap: Record<string, string> = {
                                            movel: "Móvel",
                                            fixo: "Fixo",
                                            hosting: "Hosting",
                                            proxy: "Proxy",
                                            local: "Local",
                                            desconhecido: "Desconhecido",
                                        };

                                        return accessTypeMap[String(benefitsData?.ip_access_type ?? "")] ?? "-";
                                    })()}
                                />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="URL" value={benefitsData?.url} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Plataforma" value={formatOSDisplay(benefitsData?.fingerprint?.os)} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Dispositivo" value={formatDevice(benefitsData?.fingerprint?.device || "-")} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Browser" value={formatBrowserDisplay(benefitsData?.fingerprint?.browser)} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="TimeZone"
                                    value={[
                                        benefitsData?.fingerprint?.timezone,
                                        benefitsData?.fingerprint?.timezone_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" - ") || "-"}
                                    copyable
                                />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="Resolução" value={formatResolution(benefitsData?.fingerprint?.resolution || "-")} copyable />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField label="ID Fingerprint" value={benefitsData?.fingerprint_id || "-"} copyable />
                            </Col>
                        </Row>
                    </OrderModalSection>

                    {/* {(benefitsData?.status === "FECHADO" || benefitsData?.status === "fechado") &&
                        getAlertScenarios({ single_zip_code: benefitsData?.single_zip_code, status: benefitsData?.status }).map((scenario, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-2 mb-3 rounded-sm p-3 w-full"
                                style={{ backgroundColor: scenario.color }}
                            >
                                <div className="flex items-center">
                                    <h2 className="text-[14px] font-semibold">
                                        <ExclamationOutlined />
                                        <ExclamationOutlined /> ALERTA
                                        <ExclamationOutlined />
                                        <ExclamationOutlined />
                                    </h2>
                                </div>
                                <div className="flex flex-col text-neutral-800 gap-2 rounded-lg min-h-12 p-3">
                                    <div className="text-[14px] w-full text-neutral-700">{scenario.content}</div>
                                </div>
                            </div>
                        ))} */}

                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    hoverBorderColor: "#242424",
                                    activeBorderColor: "#242424",
                                    activeShadow: "none",
                                    colorBorder: "#bfbfbf",
                                    colorTextPlaceholder: "#666666",
                                },
                                Button: {
                                    colorBorder: "#242424",
                                    colorText: "#242424",
                                    colorPrimary: "#242424",
                                    colorPrimaryHover: "#242424",
                                },
                            },
                        }}
                    >
                        <div className="flex flex-col justify-center bg-neutral-100 text-[14px] rounded-sm mt-3">
                            <div className="p-4 pb-0">
                                <p className="text-[15px]">Observação Consultor</p>
                            </div>
                            <Form form={form} layout="vertical">
                                <div className="flex flex-col p-4 text-[14px] w-full text-neutral-700">
                                    <Form.Item name="consultant_observation" style={{ marginBottom: 8 }}>
                                        <Input.TextArea
                                            autoSize={{ minRows: 3, maxRows: 6 }}
                                            className="text-[16px] font-light text-[#353535] w-full"
                                            placeholder="Adicione aqui uma observação sobre esse pedido..."
                                        />
                                    </Form.Item>
                                    <Button
                                        className="self-end"
                                        loading={updateMutation.isPending}
                                        style={{ fontSize: "12px", height: "25px" }}
                                        onClick={handleSaveObservacao}
                                    >
                                        Salvar
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </ConfigProvider>
                </div></div>
        </OrderModalShell>
    );
}