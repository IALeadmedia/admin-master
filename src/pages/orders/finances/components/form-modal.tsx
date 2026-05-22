import { useEffect } from "react";
import { Col, Form, Input, Row, Select, } from "antd";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import { entityPage, useUpdateEntity, type EntityType } from "../../config-page.const";
import type { FinanceOrderFormValues } from "@/types/orders";
import { OrderModalSection } from "../../common/components/order-modal-section";

interface FormModalProps {
    open: boolean;
    editingEntity: EntityType | null;
    onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
    const [form] = Form.useForm<FinanceOrderFormValues>();
    const updateMutation = useUpdateEntity();
    const isEditing = Boolean(editingEntity);
    const isPending = updateMutation.isPending;

    const selectedPropertyType =
        Form.useWatch(["address_complement", "building_or_house"], form) ||
        editingEntity?.address_complement?.building_or_house ||
        "house";

    useEffect(() => {
        if (open && editingEntity) {
            form.setFieldsValue({
                full_name: editingEntity.full_name ?? undefined,
                cpf: editingEntity.cpf ?? undefined,
                email: editingEntity.email ?? undefined,
                phone: editingEntity.phone ?? undefined,
                address: editingEntity.address ?? undefined,
                address_number: editingEntity.address_number ?? undefined,
                district: editingEntity.district ?? undefined,
                city: editingEntity.city ?? undefined,
                state: editingEntity.state ?? undefined,
                zip_code: editingEntity.zip_code ?? undefined,
                single_zip_code:
                    editingEntity.single_zip_code === null || editingEntity.single_zip_code === undefined
                        ? undefined
                        : Boolean(editingEntity.single_zip_code),
                consultant_observation: editingEntity.consultant_observation ?? undefined,
                address_complement: {
                    building_or_house: editingEntity.address_complement?.building_or_house ?? "house",
                    home_complement: editingEntity.address_complement?.home_complement ?? null,
                    unit_type: editingEntity.address_complement?.unit_type ?? null,
                    unit_number: editingEntity.address_complement?.unit_number ?? null,
                    floor: editingEntity.address_complement?.floor ?? null,
                    lot: editingEntity.address_complement?.lot ?? null,
                    square: editingEntity.address_complement?.square ?? null,
                    reference_point: editingEntity.address_complement?.reference_point ?? null,
                },
            });
            return;
        }

        if (open) {
            form.resetFields();
        }
    }, [editingEntity, form, open]);

    async function handleSubmit() {
        if (!editingEntity) {
            onClose();
            return;
        }

        const values = await form.validateFields();

        updateMutation.mutate(
            {
                id: editingEntity.id,
                payload: {
                    ...values,
                    address_complement: {
                        building_or_house: values.address_complement?.building_or_house ?? "house",
                        home_complement: values.address_complement?.home_complement ?? null,
                        unit_type: values.address_complement?.unit_type ?? null,
                        unit_number: values.address_complement?.unit_number ?? null,
                        floor: values.address_complement?.floor ?? null,
                        lot: values.address_complement?.lot ?? null,
                        square: values.address_complement?.square ?? null,
                        reference_point: values.address_complement?.reference_point ?? null,
                    },
                },
            },
            { onSuccess: onClose },
        );
    }

    return (
        <OrderModalShell
            open={open}
            title={isEditing ? `Editar ${entityPage.name}` : `Novo(a) ${entityPage.name}`}
            onCancel={onClose}
            okText={isEditing ? "Salvar" : "Criar"}
            cancelText="Cancelar" onOk={handleSubmit}

            confirmLoading={isPending}
            destroyOnHidden
            width={960}

        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }} onFinish={handleSubmit} className="max-h-110 overflow-y-auto scrollbar-thin">
                <OrderModalSection title="Informações do Cliente">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="full_name" label="Nome completo">
                                <Input placeholder="Nome completo" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="cpf" label="CPF">
                                <Input placeholder="000.000.000-00" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="cnpj" label="CNPJ" rules={[
                                { min: 14, message: 'CNPJ deve ter 14 dígitos' },
                                { max: 14, message: 'CNPJ deve ter 14 dígitos' },
                            ]}>
                                <Input placeholder="00.000.000/0000-00" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="birth_date" label="Data de nascimento">
                                <Input placeholder="DD/MM/AAAA" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Email inválido" }]}>
                                <Input placeholder="exemplo@email.com" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="mother_full_name" label="Nome da mãe">
                                <Input placeholder="Nome da mãe" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="phone" label="Telefone">
                                <Input placeholder="(00) 00000-0000" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="additional_phone" label="Telefone adicional">
                                <Input placeholder="(00) 00000-0000" />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Endereço">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="address" label="Endereço">
                                <Input placeholder="Endereço" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="address_number" label="Número">
                                <Input placeholder="Número" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "building_or_house"]} label="Tipo">
                                <Select
                                    placeholder="Tipo"
                                    options={[
                                        { label: "Casa", value: "house" },
                                        { label: "Edifício", value: "building" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            {selectedPropertyType === "house" ? (
                                <Form.Item name={["address_complement", "home_complement"]} label="Complemento">
                                    <Input placeholder="Complemento" />
                                </Form.Item>
                            ) : (
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item name={["address_complement", "unit_type"]} label="Tipo da unidade">
                                            <Select
                                                placeholder="Unidade"
                                                options={[
                                                    { label: "Apartamento", value: "apto" },
                                                    { label: "Sala", value: "sala" },
                                                    { label: "Conjunto", value: "conjunto" },
                                                    { label: "Loja", value: "loja" },
                                                    { label: "Outros", value: "outros" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name={["address_complement", "unit_number"]} label="Número da unidade">
                                            <Input placeholder="Ex: 1203" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "floor"]} label="Andar">
                                <Input placeholder="Andar" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "lot"]} label="Lote">
                                <Input placeholder="Lote" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "square"]} label="Quadra">
                                <Input placeholder="Quadra" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={["address_complement", "reference_point"]} label="Ponto de referência">
                                <Input placeholder="Ponto de referência" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="single_zip_code" label="CEP único">
                                <Select
                                    allowClear
                                    placeholder="Selecione"
                                    options={[
                                        { label: "Sim", value: true },
                                        { label: "Não", value: false },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="district" label="Bairro">
                                <Input placeholder="Bairro" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="city" label="Cidade">
                                <Input placeholder="Cidade" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="state" label="UF">
                                <Input placeholder="UF" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="zip_code" label="CEP">
                                <Input placeholder="CEP" />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Observação do Consultor">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="consultant_observation">
                                <Input.TextArea rows={3} placeholder="Adicione aqui uma observação sobre esse pedido..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>
            </Form>
        </OrderModalShell>
    );
}
