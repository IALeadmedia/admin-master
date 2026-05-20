import { CopyOutlined, ExclamationOutlined } from "@ant-design/icons";
import { Button, Col, ConfigProvider, Form, Input, Row, Tooltip, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { OrderModalSection } from "../../common/components/order-modal-section";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatBrowserDisplay, formatDevice, formatOSDisplay, formatResolution } from "@/utils/orders.util";
import { useUpdateEntity } from "../../config-page.const";
import type { FinanceOrder } from "@/types/orders";

const financeProductLabelMap = {
    "conta-pj": "Conta PJ",
    "capital-giro-c6": "Capital de Giro",
    maquininha: "Maquininha",
    investimentos: "Investimentos",
    "cartao-credito": "Cartão de Crédito",
    "reducao-dividas": "Redução de Dívidas",
    outro: "Outro",
} as const;

type FinanceProductKey = keyof typeof financeProductLabelMap;

interface EmpresasDisplayProps {
    empresas?: unknown;
}

function EmpresasDisplay({ empresas }: EmpresasDisplayProps) {
    const [tooltipTitle, setTooltipTitle] = useState("Copiar");

    const empresasFormatadas = useMemo(() => {
        if (!empresas) return "-";

        const asArray = Array.isArray(empresas) ? empresas : [empresas];
        const formatted = asArray
                .map((empresa: { cnpj?: string | null; nome?: string | null; porte?: string | null }) =>
                    `${empresa.cnpj || "-"}, ${empresa.nome || "-"}, ${empresa.porte || "-"}`,
                )
            .join("; \n");

        return formatted || "-";
    }, [empresas]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(empresasFormatadas);
            setTooltipTitle("Copiado!");
            message.success("Copiado!");
            window.setTimeout(() => setTooltipTitle("Copiar"), 2000);
        } catch {
            message.error("Erro ao copiar");
        }
    };

    const isLongText = empresasFormatadas.length > 80;
    const previewText = isLongText ? `${empresasFormatadas.substring(0, 80)}...` : empresasFormatadas;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography.Text type="secondary">Empresas</Typography.Text>
            <div
                style={{
                    minHeight: 30,
                    padding: "4px 10px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.015)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                {isLongText ? (
                    <Tooltip
                        placement="topLeft"
                        title={<div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>}
                    >
                        <Typography.Text style={{ cursor: "pointer", flex: 1 }}>{previewText}</Typography.Text>
                    </Tooltip>
                ) : (
                    <Typography.Text style={{ whiteSpace: "pre-line", flex: 1 }}>{previewText}</Typography.Text>
                )}

                {empresasFormatadas !== "-" && (
                    <Tooltip title={tooltipTitle}>
                        <CopyOutlined
                            onClick={handleCopy}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

interface ViewModalProps {
    open: boolean;
    viewingEntity: FinanceOrder | null;
    onClose: () => void;
    onEdit?: (entity: FinanceOrder) => void;
    onDelete?: (entity: FinanceOrder) => void;
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
    const [form] = Form.useForm();
    const updateMutation = useUpdateEntity();

    const financeData = viewingEntity;

    useEffect(() => {
        if (open && financeData) {
            form.setFieldsValue({
                consultant_observation: financeData.consultant_observation || "",
            });
        }
    }, [financeData, form, open]);

    const getAlertScenarios = (single_zip_code?: boolean | null, status?: string) => {
        const scenarios: { color: string; content: React.ReactNode }[] = [];
        const hasUnicCep = Boolean(single_zip_code);

        if (status === "FECHADO" || status === "fechado") {
            if (hasUnicCep) {
                scenarios.push({ color: "#fff6c7", content: "CEP Único" });
            }
        }

        if ((status === "FECHADO" || status === "fechado") && !hasUnicCep) {
            scenarios.push({ color: "#e6ffed", content: "Esse pedido não possui travas" });
        }

        return scenarios;
    };

    const handleSaveObservacao = async () => {
        const values = await form.validateFields();
        if (values.consultant_observation?.trim() !== "" && financeData) {
            updateMutation.mutate({
                id: financeData.id,
                payload: { consultant_observation: values.consultant_observation },
            });
        }
    };

    const produtoPrincipal =
        financeData?.landing_page === "conta-pj"
            ? "Conta PJ"
            : financeData?.landing_page === "cartao-pj-c6"
                ? "Cartão PJ"
                : financeData?.landing_page === "maquininha-c6-empresas"
                    ? "Maquininha"
                    : "-";

    const outrosProdutos = (() => {
        if (!financeData?.products_of_interest) return "-";

        const products = Array.isArray(financeData.products_of_interest)
            ? financeData.products_of_interest
            : [financeData.products_of_interest];

        return products.length
            ? products.map((product: string) => financeProductLabelMap[product as FinanceProductKey] ?? product).join(", ")
            : "-";
    })();

    return (
        <OrderModalShell
            open={open}
            title={`Pedido Nº ${financeData?.order_number || financeData?.id || "-"}`}
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button type="primary" onClick={() => financeData && onEdit?.(financeData)}>
                        Editar
                    </Button>
                    <Button danger style={{ display: canDelete ? "inline-flex" : "none" }} onClick={() => financeData && onDelete?.(financeData)}>
                        Deletar
                    </Button>
                </div>
            }
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <OrderModalSection title="Produtos de Interesse">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="Produto Principal" value={produtoPrincipal} />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Outros Produtos" value={outrosProdutos} />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="App C6 Bank">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField
                                label="Click App"
                                value={financeData?.app_click == null ? "-" : financeData.app_click ? "Sim" : "Não"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Data/Hora Click"
                                value={financeData?.app_click_at ? new Date(financeData.app_click_at).toLocaleString("pt-BR") : "-"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Cadastro App"
                                value={financeData?.app_register == null ? "-" : financeData.app_register ? "Sim" : "Não"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Data/Hora Cadastro"
                                value={financeData?.app_register_at ? new Date(financeData.app_register_at).toLocaleString("pt-BR") : "-"}
                            />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Informações do Cliente">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={financeData?.whatsapp?.avatar || "/assets/anonymous_avatar.png"}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            outline: financeData?.pf_temperature === 10 ? "2px solid #d63535" : "none",
                                        }}
                                    />
                                    {financeData?.pf_temperature === 10 && (
                                        <span style={{ position: "absolute", top: -4, right: -4, fontSize: 12 }}>🔥</span>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome" value={financeData?.full_name} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome (RFB)" value={financeData?.rfb_name} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="CPF" value={formatCPF(financeData?.cpf || "")} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Gênero (RFB)"
                                value={financeData?.rfb_gender === "M" ? "Masculino" : financeData?.rfb_gender === "F" ? "Feminino" : "-"}
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Data Nascimento (RFB)" value={financeData?.rfb_birth_date} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome Mãe (RFB)" value={financeData?.rfb_mother_name} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Email" value={financeData?.email} copyable />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Contato">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8 }}>Telefone Principal</p>
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <ReadonlyField label="Número" value={formatPhoneNumber(financeData?.phone || "")} copyable />
                                </Col>
                                <Col span={12}>
                                    <ReadonlyField
                                        label="Anatel"
                                        value={financeData?.phone_valid == null ? "-" : financeData.phone_valid ? "Sim" : "Não"}
                                    />
                                </Col>
                                <Col span={12}>
                                    <ReadonlyField label="Portado" value={financeData?.portability} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Informações Empresariais">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <ReadonlyField label="Sócio" value={financeData?.is_socio ? "Sim" : "Não"} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="MEI" value={financeData?.is_mei ? "Sim" : "Não"} />
                        </Col>
                        <Col span={12}>
                            <EmpresasDisplay empresas={financeData?.company_partners} />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Endereço">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="Rua" value={financeData?.address || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Número" value={financeData?.address_number || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField
                                label="Complemento"
                                value={
                                    financeData?.address_complement?.building_or_house === "house"
                                        ? financeData?.address_complement?.home_complement || "-"
                                        : financeData?.address_complement?.building_or_house === "building"
                                            ? `${financeData?.address_complement?.unit_type || "-"} ${financeData?.address_complement?.unit_number || "-"}`
                                            : "-"
                                }
                                copyable
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Bairro" value={financeData?.district || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Cidade" value={financeData?.city || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="UF" value={financeData?.state || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="CEP" value={formatCEP(financeData?.zip_code || "")} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="CEP Único" value={financeData?.single_zip_code ? "Sim" : "Não"} />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Quadra" value={financeData?.address_complement?.square || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Lote" value={financeData?.address_complement?.lot || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Tipo"
                                value={financeData?.address_complement?.building_or_house === "building" ? "Edifício" : "Casa"}
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Andar" value={financeData?.address_complement?.floor || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Ponto de Referência" value={financeData?.address_complement?.reference_point || "-"} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Coordenadas"
                                value={
                                    financeData?.geolocation?.latitude && financeData?.geolocation?.longitude
                                        ? `${financeData.geolocation.latitude}, ${financeData.geolocation.longitude}`
                                        : "-"
                                }
                            />
                        </Col>
                        <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                            <a href={financeData?.geolocation?.maps_link} target="_blank" rel="noopener noreferrer" style={{ color: "#242424", textDecoration: "underline" }}>
                                Ver no Google Maps
                            </a>
                        </Col>
                        <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                            <a href={financeData?.geolocation?.street_view_link} target="_blank" rel="noopener noreferrer" style={{ color: "#242424", textDecoration: "underline" }}>
                                Ver no Street View
                            </a>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Dados do Tráfego">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="IP" value={financeData?.client_ip} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Provedor" value={financeData?.ip_isp} />
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

                                    return accessTypeMap[String(financeData?.ip_access_type ?? "")] ?? "-";
                                })()}
                                                        />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="URL" value={financeData?.url} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Plataforma" value={formatOSDisplay(financeData?.fingerprint?.os)} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Dispositivo" value={formatDevice(financeData?.fingerprint?.device || "-")} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Browser" value={formatBrowserDisplay(financeData?.fingerprint?.browser)} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="TimeZone"
                                value={[
                                    financeData?.fingerprint?.timezone,
                                    financeData?.fingerprint?.timezone_name,
                                ]
                                    .filter(Boolean)
                                    .join(" - ") || "-"}
                                copyable
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Resolução" value={formatResolution(financeData?.fingerprint?.resolution || "-")} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="ID Fingerprint" value={financeData?.fingerprint_id || "-"} copyable />
                        </Col>
                    </Row>
                </OrderModalSection>

                {(financeData?.status === "FECHADO" || financeData?.status === "fechado") &&
                    getAlertScenarios(financeData?.single_zip_code, financeData?.status).map((scenario, idx) => (
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
                    ))}

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
            </div>
        </OrderModalShell>
    );
}