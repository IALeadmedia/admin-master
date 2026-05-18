import { useEffect } from "react";
import { Form, Input, Modal, Row, Col, Select, InputNumber } from "antd";
import { useCreateEntity, useUpdateEntity, entityPage, type EntityType } from "../config-page.const";


interface FormModalProps {
    open: boolean;
    editingEntity: EntityType | null;
    category: string;
    onClose: () => void;
}

export type FinanciesFormValues = {
    name: string;
    company: string;
    business_partner: string;
    category?: string;
    client_type: "PF" | "PJ";
    company_id?: number | null;
    partner_id?: number | null;
    interest_rate?: number;
    max_amount?: number;
    min_amount?: number;
    description?: string;
};

export function FormModal({ open, editingEntity, category, onClose }: FormModalProps) {
    const [form] = Form.useForm<FinanciesFormValues>();
    const createMutation = useCreateEntity();
    const updateMutation = useUpdateEntity();

    const isEditing = !!editingEntity;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (open && editingEntity) {
            form.setFieldsValue({
                ...editingEntity,
                company_id: editingEntity.company_id ?? undefined,
                partner_id: editingEntity.partner_id ?? undefined,
            });
        } else if (open) {
            form.resetFields();
        }
    }, [open, editingEntity, form]);

    async function handleSubmit() {
        const values = await form.validateFields();

        const entityPayload = {
            ...values,
        };

        if (isEditing && editingEntity) {
            updateMutation.mutate(
                {
                    id: editingEntity.id,
                    entity: {
                        ...entityPayload,
                        company_id: values.company_id ?? editingEntity.company_id ?? null,
                        partner_id: values.partner_id ?? editingEntity.partner_id ?? null,
                    },
                },
                { onSuccess: onClose }
            );
        } else {
            createMutation.mutate(
                {
                    entity: {
                        ...entityPayload,
                        category,
                        company: "TIM",
                        company_id: values.company_id ?? null,
                        partner_id: values.partner_id ?? null,
                    },
                },
                { onSuccess: onClose }
            );
        }
    }

    return (
        <Modal
            open={open}
            title={isEditing ? `Editar ${entityPage.name}` : `Novo(a) ${entityPage.name}`}
            okText={isEditing ? "Salvar" : "Criar"}
            cancelText="Cancelar"
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={isPending}
            destroyOnHidden
            width={700}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <div className="max-h-115 overflow-y-auto scrollbar-thin">
                    {/* Nome e Badge */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Nome"
                                rules={[{ required: true, message: "Nome é obrigatório" }]}
                            >
                                <Input placeholder="Digite o nome do produto" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="client_type"
                                label="Tipo de Cliente"
                                rules={[{ required: true, message: "Tipo de cliente é obrigatório" }]}
                            >
                                <Select placeholder="Selecione o tipo">
                                    <Select.Option value="PF">Pessoa Física (PF)</Select.Option>
                                    <Select.Option value="PJ">Pessoa Jurídica (PJ)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Valores Financeiros */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="interest_rate"
                                label="Taxa de Juros (%)"
                            >
                                <InputNumber
                                    placeholder="Ex: 2.5"
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="min_amount"
                                label="Valor Mínimo (R$)"
                            >
                                <InputNumber
                                    placeholder="Ex: 1000"
                                    min={0}
                                    step={100}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="max_amount"
                                label="Valor Máximo (R$)"
                            >
                                <InputNumber
                                    placeholder="Ex: 50000"
                                    min={0}
                                    step={100}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Descrição */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Descrição"
                            >
                                <Input.TextArea
                                    placeholder="Descrição do produto financeiro"
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </Form>
        </Modal>
    );
}
