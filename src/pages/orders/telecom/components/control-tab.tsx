import { appSetting } from "@/constants/app-setting/config.const";
import { Row, Col, Select, Input, ConfigProvider, Typography, Form } from "antd";
import type { FormInstance } from "antd";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { UsersService } from "@/services/users.service";
import { OrderModalSection } from "../../common/components/order-modal-section";
import type { EntityType } from "../../config-page.const";

type ControlFormValues = {
    consultor?: string;
    idCRM?: string;
    idCORP?: string;
    credit?: string;
    team?: string;
    input_crm?: boolean;
    availability_crm?: string;
    debt_with_operator?: string;
    contract?: string;
    biometrics?: string;
};

export function OrderControlTab({
    viewingEntity,
    updateMutation,
    form,
}: {
    viewingEntity: EntityType;
    updateMutation: { mutate: (variables: { id: number; payload: Record<string, unknown> }) => void };
    form: FormInstance<ControlFormValues>;
}) {

    useEffect(() => {
        if (!viewingEntity) return;
        form.setFieldsValue({
            consultor: viewingEntity.responsible_consultant || "",
            idCRM: viewingEntity.crm_id != null ? String(viewingEntity.crm_id) : "",
            idCORP: viewingEntity.corporate_id || "",
            credit: viewingEntity.credit ?? undefined,
            team: viewingEntity.team ?? undefined,
            input_crm: viewingEntity.input_crm ?? undefined,
            availability_crm: viewingEntity.availability_crm ?? undefined,
            debt_with_operator: viewingEntity.debt_with_operator ?? undefined,
            contract: viewingEntity.contract ?? undefined,
            biometrics: viewingEntity.biometrics ?? undefined,
        });
    }, [form, viewingEntity]);

    const handleFinish = (values: ControlFormValues) => {
        updateMutation.mutate({
            id: viewingEntity.id,
            payload: {
                responsible_consultant: values.consultor,
                corporate_id: values.idCORP,
                crm_id: values.idCRM,
                team: values.team,
                input_crm: values.input_crm,
                availability_crm: values.availability_crm,
                credit: values.credit,
                debt_with_operator: values.debt_with_operator,
                contract: values.contract,
                biometrics: values.biometrics,
            },
        });
    };

    const { user } = useAuth();
    const { selectedCompanyId, selectedPartnerId } = useAdminScope();

    const companyId = isAdminDomain ? selectedCompanyId : (user?.user.company_id ?? undefined);
    const partnerId = isAdminDomain ? selectedPartnerId : (user?.user.partner_id ?? undefined);
    const hasScope = companyId != null || partnerId != null;

    const { data: usersData } = useQuery({
        queryKey: ["consultant-users", companyId, partnerId],
        queryFn: () =>
            UsersService.getAll({
                ...(companyId != null ? { company_id: companyId } : {}),
                ...(partnerId != null ? { partner_id: partnerId } : {}),

            }),
        enabled: hasScope,
    });

    const consultorOptions = (usersData?.users ?? []).map((u) => ({
        value: u.user_name,
        label: u.user_name + " - " + u.role,
    }));

    const color = appSetting.primaryColor;
    return (
        <Form form={form} onFinish={handleFinish}>
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
                            <Col span={7}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Consultor</Typography.Text>
                                    <Form.Item name="consultor" noStyle>
                                        <Select
                                            showSearch
                                            size="small"
                                            style={{ width: 240 }}
                                            options={consultorOptions}
                                            filterOption={(input, option) =>
                                                (option?.label as string)
                                                    ?.toLowerCase()
                                                    .includes(input.toLowerCase())
                                            }
                                            allowClear
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">ID CORP</Typography.Text>
                                    <Form.Item name="idCORP" noStyle>
                                        <Input size="small" style={{ width: 160 }} maxLength={8} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Equipe</Typography.Text>
                                    <Form.Item name="team" noStyle>
                                        <Select showSearch size="small" style={{ width: 200 }} options={[]} />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="CRM">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">ID CRM</Typography.Text>
                                    <Form.Item name="idCRM" noStyle>
                                        <Input size="small" style={{ width: 160 }} maxLength={8} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Input CRM</Typography.Text>
                                    <Form.Item name="input_crm" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 160 }}
                                            options={[
                                                { value: true, label: "Sim" },
                                                { value: false, label: "Não" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>

                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Disponibilidade CRM</Typography.Text>
                                    <Form.Item name="availability_crm" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 160 }}
                                            options={[
                                                { value: "sim", label: "Sim" },
                                                { value: "não", label: "Não" },
                                                { value: "sem análise", label: "Sem análise" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </OrderModalSection>

                    <OrderModalSection title="Formalização e Análise">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Crédito</Typography.Text>

                                    <Form.Item name="credit" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            options={[
                                                { value: "positivo", label: "Positivo" },
                                                { value: "negativo", label: "Negativo" },
                                                { value: "sem análise", label: "Sem análise" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Débito Operadora</Typography.Text>

                                    <Form.Item name="debt_with_operator" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 160 }}
                                            options={[
                                                { value: "sim", label: "Sim" },
                                                { value: "não", label: "Não" },
                                                { value: "sem análise", label: "Sem análise" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>

                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Contrato</Typography.Text>

                                    <Form.Item name="contract" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 160 }}
                                            options={[
                                                { value: "não enviado", label: "Não enviado" },
                                                { value: "aguardando", label: "Aguardando" },
                                                { value: "assinado", label: "Assinado" },
                                                { value: "cancelado", label: "Cancelado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>

                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Biometria</Typography.Text>

                                    <Form.Item name="biometrics" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 160 }}
                                            options={[
                                                { value: "não enviada", label: "Não enviada" },
                                                { value: "aguardando", label: "Aguardando" },
                                                { value: "realizado", label: "Realizado" },
                                                { value: "cancelado", label: "Cancelado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>

                        </Row>
                    </OrderModalSection>
                </ConfigProvider>
            </div>
        </Form>
    );
}