import { App, Button, Form, ConfigProvider, Select, Tooltip, Tabs } from "antd";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import { useEffect, useState } from "react";
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

    // VIVO: usa os campos diretos do pedido
    // Outros: lê operators_availability com fallback de nome de campo (API vs tipo)
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
    const { message } = App.useApp();
    const [observationForm] = Form.useForm();
    const updateMutation = useUpdateEntity();
    const statusMutation = useUpdateOrderStatusMutation();

    // const [consultor, setConsultor] = useState("");
    // const [idCRM, setIdCRM] = useState("");
    // const [idCORP, setIdCORP] = useState("");
    // const [credito, setCredito] = useState("");
    // const [equipe, setEquipe] = useState("");
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // const toggleExpand = (id: string) => {
    //     setExpanded((prev) => ({
    //         ...prev,
    //         [id]: !prev[id],
    //     }));
    // };

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

    if (!viewingEntity) {
        return null;
    }

    // const resolvedCompanyName = viewingEntity.company ?? null;

    const handleSaveObservacao = async () => {
        const values = await observationForm.validateFields();
        if (values.consultant_observation?.trim() !== "") {
            updateMutation.mutate({
                id: viewingEntity!.id,
                payload: { consultant_observation: values.consultant_observation },
            });
        }
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
                                {/* <div className="flex flex-wrap gap-4">
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
                                </div> */}
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Pedido:</span>
                                        <Select size="small" style={{ width: 110 }} value={viewingEntity?.status} onChange={(value) => statusMutation.mutate({ id: viewingEntity!.id, payload: { status: value } })} options={[{ value: "ABERTO", label: "Aberto" }, { value: "FECHADO", label: "Fechado" }, { value: "CANCELADO", label: "Cancelado" }, { value: "TRANSBORDO", label: "Transbordo" }]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Tramitação:</span>
                                        <Select placeholder="Selecione o status" size="small" value={viewingEntity?.after_sales_status} style={{ width: 280 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { after_sales_status: value } })} options={[]} />
                                    </div>

                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {/* <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Crédito:</span>
                                        <Input size="small" placeholder="Crédito" style={{ width: 100 }} maxLength={13} value={credito} onChange={(e) => setCredito(e.target.value)} onPressEnter={() => { const normalizedCredit = Number(String(credito ?? "").replace(/\s+/g, "").replace(",", ".")); updateMutation.mutate({ id: viewingEntity!.id, payload: { credit: Number.isNaN(normalizedCredit) ? 0 : normalizedCredit } }); }} />
                                    </div> */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Atendimento:</span>
                                        <Select size="small" value={viewingEntity?.service} style={{ width: 160 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { service: value } })} options={[{ value: "em_andamento", label: "Em Andamento" }, { value: "concluido", label: "Concluído" }]} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold">Instalação:</span>
                                        <Select size="small" value={viewingEntity?.installation} style={{ width: 160 }} onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { installation: value } })} options={[{ value: "não agendado", label: "Não Agendado" }, { value: "agendado", label: "Agendado" }, { value: "instalado", label: "Instalado" }, { value: "inviável", label: "Inviável" }, { value: "cancelado", label: "Cancelado" }]} />
                                    </div>
                                </div>
                            </ConfigProvider>
                        </div>
                    </div>
                </>
            }
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
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
            }
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >
            <Tabs
                defaultActiveKey="details"

                items={[
                    {
                        key: "details",
                        label: "Dados do Pedido",
                        children: (
                            <OrderDetailsTab
                                viewingEntity={viewingEntity}
                                companyName={companyName}
                                isAdmin={isAdmin}
                                partnerName={partnerName}
                                color={color}
                                observationForm={observationForm}
                                updateMutation={updateMutation}
                                handleSaveObservacao={handleSaveObservacao}
                            />
                        ),
                    }, {
                        key: "control",
                        label: "Controle",
                        children: (
                            <OrderControlTab
                                viewingEntity={viewingEntity}
                                updateMutation={updateMutation}
                            />
                        ),
                    },
                    {
                        key: "history",
                        label: "Histórico",
                        children: (
                            <OrderHistoryTab
                                orderId={viewingEntity.id}
                            />
                        ),
                    },
                    {
                        key: "notes",
                        label: "Observações",
                        children: (
                            <OrderNotesTab
                                handleSaveObservacao={handleSaveObservacao}
                                orderId={viewingEntity.id}
                            />
                        ),
                    },


                    {
                        key: "transhipment",
                        label: "Transbordo",
                        children: (
                            isAdmin && <TranshipmentTab

                                viewingEntity={viewingEntity}
                            />
                        ),
                    },
                ]}
            />
        </OrderModalShell>
    );
}
