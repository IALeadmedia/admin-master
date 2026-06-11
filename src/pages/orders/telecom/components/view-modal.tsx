import { App, Button, Form, ConfigProvider, Select, Tooltip, Tabs, Badge } from "antd";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import { useState } from "react";
import { useUpdateOrderStatusMutation } from "@/hooks/orders/useUpdateOrderStatusMutation";
import { appSetting, isAdminDomain } from "@/constants/app-setting/config.const";
import { useUpdateEntity, type EntityType } from "../../config-page.const";
import { useAuth } from "@/context/auth-provider";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { generateOrderPdf } from "@/utils/order-pdf.util";
import type { OrderOperatorsAvailability } from "@/types/orders";
import { OrderDetailsTab } from "./details-tab";
import { OrderHistoryTab } from "./history-tab";
import { OrderNotesTab } from "./notes-tb";
import { OrderControlTab } from "./control-tab";
import { TranshipmentTab } from "./transhipment-tab";
import { getAlertScenarios } from "@/utils/orders.util";

function resolveOperatorKey(companyName?: string | null) {
    return companyName?.split(" ")[0]?.toLowerCase().trim();
}

export const AvailabilityStatus = ({
    localData,
    companyName,
}: {
    localData: {
        operators_availability?: OrderOperatorsAvailability | null;
        availability?: boolean | number | null;
        found_via_range?: boolean | null;
    };
    companyName?: string | null;
}) => {
    const operatorKey = resolveOperatorKey(companyName);
    const isVivo = operatorKey === "vivo";

    const available: boolean | number | null | undefined = isVivo
        ? localData.availability
        : (() => {
            const avail = operatorKey ? localData.operators_availability?.[operatorKey] : undefined;
            return avail?.availability ?? avail?.available ?? null;
        })();

    const foundViaRange: boolean | null | undefined = isVivo
        ? localData.found_via_range
        : (() => {
            const avail = operatorKey ? localData.operators_availability?.[operatorKey] : undefined;
            return avail?.encontrado_via_range ?? avail?.found_via_range ?? null;
        })();

    const rangeMin = isVivo
        ? null
        : (operatorKey ? localData.operators_availability?.[operatorKey]?.range_min : null) ?? null;

    const rangeMax = isVivo
        ? null
        : (operatorKey ? localData.operators_availability?.[operatorKey]?.range_max : null) ?? null;

    if (available === null || available === undefined) {
        return (
            <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center">-</div>
            </div>
        );
    }

    if (available) {
        if (foundViaRange) {
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
                    {rangeMin != null && rangeMax != null && (
                        <div className="text-center text-[11px] text-neutral-600 bg-yellow-50 px-2 py-1 rounded">
                            <strong>Range numérico:</strong> {rangeMin} - {rangeMax}
                        </div>
                    )}
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
    if (localData.availability_pap === null || localData.availability_pap === undefined) {
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
                    <Tooltip title="PAP - Disponível" placement="top" overlayStyle={{ fontSize: "12px" }}>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
                <Tooltip title="PAP - Indisponível" placement="top" overlayStyle={{ fontSize: "12px" }}>
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
    const { message } = App.useApp();
    const currentUser = useAuth().user!;
    const [controlForm] = Form.useForm();
    const updateMutation = useUpdateEntity();
    const statusMutation = useUpdateOrderStatusMutation();
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    const { isGlobalAdmin } = useAuth();
    const isAdmin = isAdminDomain && isGlobalAdmin;
    const renderFooter = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={handleExportPdf} loading={isExportingPdf}>
                            Exportar PDF
                        </Button>
                        <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                            Editar
                        </Button>
                        {canDelete && (
                            <Button danger onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                                Deletar
                            </Button>
                        )}
                    </div>
                );
            case "control":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button type="primary" onClick={() => controlForm.submit()}>
                            Salvar
                        </Button>
                    </div>
                );
            // case "notes":
            //     return (
            //         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            //             <Button type="primary" onClick={handleSaveObservacao}>
            //                 Salvar
            //             </Button>
            //         </div>
            //     );
            default:
                return null;
        }
    };

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

    const operatorKey = companyName?.split(" ")[0]?.toLowerCase().trim();

    const operatorAvailability = operatorKey
        ? viewingEntity?.operators_availability?.[operatorKey]
        : undefined;

    const alertScenarios =
        viewingEntity?.status?.toLowerCase() === "fechado"
            ? getAlertScenarios({
                availability: operatorAvailability?.available,
                found_via_range: operatorAvailability?.found_via_range,
                single_zip_code: viewingEntity?.single_zip_code,
                status: viewingEntity?.status,
            })
            : [];

    const badgeColor = alertScenarios.some(s => s.color === "#ffeaea")
        ? "red"
        : alertScenarios.some(s => s.color === "#fff6c7")
            ? "gold"
            : "green";


    if (!viewingEntity) return null;

    const handleSaveObservacao = (values: {
        consultant_observation: string;
    }) => {
        const obs = values.consultant_observation?.trim();

        if (!obs) return;

        updateMutation.mutate({
            id: viewingEntity!.id,
            payload: {
                consultant_notes: [
                    ...(viewingEntity?.consultant_notes ?? []),
                    {
                        obs,
                        user: currentUser.user.name,
                        role: currentUser.user.role,
                    },
                ],
            },
        });
    };

    const handleExportPdf = async () => {
        if (!viewingEntity) return;
        setIsExportingPdf(true);
        try {
            await generateOrderPdf({
                order: viewingEntity,
                segmentLabel: "telecom",
                companyName,
                partnerName,
            });
        } catch {
            message.error("Nao foi possivel exportar o PDF do pedido.");
        } finally {
            setIsExportingPdf(false);
        }
    };

    const color = appSetting.primaryColor;

    const after_sales_status_enum = [
        "Em contato com cliente",
        "Ag. Retorno do cliente",
        "Contrato enviado - Ag. Assinatura Cliente",
        `Contrato assinado - Tramitando ${partnerName}`,
        `Contrato assinado - Tramitando ${companyName}`,
        "Pedido Concluído",
        `Pedido Negado ${companyName} - Crédito`,
        "Venda perdida - Oportunidade futura",
        "Venda Perdida - Sem Cobertura",
        "Venda Perdida - Sem retorno do cliente",
        "Venda Perdida - Outros",
        "Venda Perdida - Cliente não assinou",
        "Venda Perdida - Crédito Negado"
    ];
    return (
        <OrderModalShell
            open={open}
            title={
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
                                    <span className="text-[14px] font-semibold">Pedido:</span>
                                    <Select
                                        size="small"
                                        style={{ width: 110 }}
                                        value={viewingEntity?.status}
                                        onChange={(value) => statusMutation.mutate({ id: viewingEntity!.id, payload: { status: value } })}
                                        options={[
                                            { value: "ABERTO", label: "Aberto" },
                                            { value: "FECHADO", label: "Fechado" },
                                            { value: "CANCELADO", label: "Cancelado" },
                                            { value: "TRANSBORDO", label: "Transbordo" },
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Tramitação:</span>
                                    <Select
                                        placeholder="Selecione o status"
                                        size="small"
                                        value={viewingEntity?.after_sales_status}
                                        style={{ width: 340 }}
                                        onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { after_sales_status: value } })}
                                        options={after_sales_status_enum.map((status) => ({ value: status, label: status }))}
                                    />

                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Atendimento:</span>
                                    <Select
                                        size="small"
                                        value={viewingEntity?.service}
                                        style={{ width: 160 }}
                                        onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { service: value } })}
                                        options={[
                                            { value: "em_andamento", label: "Em Andamento" },
                                            { value: "concluido", label: "Concluído" },
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Instalação:</span>
                                    <Select
                                        size="small"
                                        value={viewingEntity?.installation}
                                        style={{ width: 160 }}
                                        onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { installation: value } })}
                                        options={[
                                            { value: "não agendado", label: "Não Agendado" },
                                            { value: "agendado", label: "Agendado" },
                                            { value: "instalado", label: "Instalado" },
                                            { value: "inviável", label: "Inviável" },
                                            { value: "cancelado", label: "Cancelado" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </ConfigProvider>
                    </div>
                </div>
            }
            footer={renderFooter()}
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >
            <Tabs
                defaultActiveKey="details"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "details",
                        label: (
                            <span className="flex items-center gap-1">
                                Dados do Pedido
                                {alertScenarios.length > 0 && <Badge dot color={badgeColor} />}
                            </span>
                        ),
                        children: (
                            <OrderDetailsTab
                                viewingEntity={viewingEntity}
                                companyName={companyName}
                                isAdmin={isAdmin}
                                partnerName={partnerName}
                                color={color}
                                alertScenarios={alertScenarios}
                            />
                        ),
                    },
                    {
                        key: "control",
                        label: "Controle",
                        children: (
                            <OrderControlTab
                                viewingEntity={viewingEntity}
                                updateMutation={updateMutation}
                                form={controlForm}
                            />
                        ),
                    },
                    {
                        key: "history",
                        label: "Histórico",
                        children: (
                            <OrderHistoryTab orderId={viewingEntity.id} />
                        ),
                    },
                    {
                        key: "notes",
                        label: "Observações",
                        children: (
                            <OrderNotesTab
                                handleSaveObservacao={handleSaveObservacao}
                                viewingEntity={viewingEntity}
                            />
                        ),
                    },
                    {
                        key: "transhipment",
                        label: "Transbordo",
                        children: isAdmin && (
                            <TranshipmentTab viewingEntity={viewingEntity} />
                        ),
                    },
                ]}
            />
        </OrderModalShell>
    );
}