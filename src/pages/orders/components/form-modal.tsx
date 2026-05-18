import { useEffect, useMemo } from "react";
import { Form, Input, Modal, Row, Col, Select, Typography, Checkbox, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  entityPage,
  useUpdateEntity,
  type EntityType,
  type FormValues,
} from "../config-page.const";
import { useProductQuery } from "@/hooks/products/useProductQuery";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import type { IProduct } from "@/types/IProduct.type";

type PlanSelectedExtraOption = {
  id: string;
  label: string;
  options?: Array<{
    price?: number;
    description?: string;
  }>;
};

type PlanOption = {
  label: string;
  value: number | string;
  plan: IProduct;
};


interface FormModalProps {
  open: boolean;
  editingEntity: EntityType | null;
  onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
  const [form] = Form.useForm<FormValues>();

  const updateMutation = useUpdateEntity();
  const { resolvedModule } = useResolvedOrderScope();
  const { data: productsData, isLoading: isLoadingPlans } = useProductQuery({
    model: resolvedModule,
    filters: {
      category: editingEntity?.category ?? undefined,
    },
    enabled: open,
  });

  const isEditing = !!editingEntity;
  const isPending = updateMutation.isPending || isLoadingPlans;
  const selectedPropertyType = Form.useWatch(
    ["address_complement", "building_or_house"],
    form,
  ) || "house";
  const selectedPlanId = Form.useWatch("plan_id", form);

  const planOptions = useMemo<PlanOption[]>(
    () => (productsData?.products ?? []).map((product) => ({
      label: product.name,
      value: product.id,
      plan: product,
    })),
    [productsData?.products],
  );

  const selectedPlan = useMemo(
    () => planOptions.find((option) => String(option.value) === String(selectedPlanId))?.plan,
    [planOptions, selectedPlanId],
  );

  const extrasOptions = useMemo<PlanSelectedExtraOption[]>(() => {
    if (!selectedPlan?.online) return [];

    return (selectedPlan.extras?.non_client ?? []).map((extra) => ({
      id: extra.id,
      label: extra.label,
      options: extra.options,
    }));
  }, [selectedPlan]);

  function handlePlanChange(planId: number | string) {
    form.setFieldValue("plan_id", planId);

    const currentSelectedExtras = (form.getFieldValue("selected_extras") ?? []) as (string | number)[];
    if (!currentSelectedExtras.length) return;

    const foundPlan = planOptions.find((plan) => String(plan.value) === String(planId))?.plan;
    const validExtraIds = new Set(
      (foundPlan?.online ? foundPlan.extras?.non_client ?? [] : []).map((extra) => String(extra.id)),
    );

    const filteredSelected = currentSelectedExtras.filter((extraId) =>
      validExtraIds.has(String(extraId)),
    );

    form.setFieldValue("selected_extras", filteredSelected);
  }

  useEffect(() => {
    if (open && editingEntity) {
      const addressComplement = {
        lot: editingEntity.address_complement?.lot ?? editingEntity.address_lot ?? null,
        block: editingEntity.address_complement?.block ?? null,
        floor: editingEntity.address_complement?.floor ?? editingEntity.address_floor ?? null,
        square: editingEntity.address_complement?.square ?? editingEntity.address_block ?? null,
        unit_type: editingEntity.address_complement?.unit_type ?? null,
        unit_number: editingEntity.address_complement?.unit_number ?? null,
        home_complement: editingEntity.address_complement?.home_complement ?? null,
        reference_point:
          editingEntity.address_complement?.reference_point ??
          editingEntity.address_reference_point ??
          null,
        building_or_house: editingEntity.address_complement?.building_or_house ?? "house",
      };

      form.setFieldsValue({
        plan_id: editingEntity.plan?.id,
        installation_preferred_date_one:
          editingEntity.installation_preferred_date_one
            ? dayjs(editingEntity.installation_preferred_date_one)
            : undefined,
        installation_preferred_period_one:
          editingEntity.installation_preferred_period_one ?? undefined,
        installation_preferred_date_two:
          editingEntity.installation_preferred_date_two
            ? dayjs(editingEntity.installation_preferred_date_two)
            : undefined,
        installation_preferred_period_two:
          editingEntity.installation_preferred_period_two ?? undefined,
        full_name: editingEntity.full_name ?? undefined,
        cpf: editingEntity.cpf ?? undefined,
        birth_date: editingEntity.birth_date ?? undefined,
        email: editingEntity.email ?? undefined,
        mother_full_name: editingEntity.mother_full_name ?? undefined,
        phone: editingEntity.phone ?? undefined,
        additional_phone: editingEntity.additional_phone ?? undefined,
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
        selected_extras:
          editingEntity.selected_extras?.map((extra) => extra.id) ?? undefined,
        cnpj: editingEntity.cnpj || "",
        due_day:
          typeof editingEntity.due_day === "number"
            ? editingEntity.due_day
            : Number(editingEntity.due_day || 0) || undefined,
        availability_pap:
          editingEntity.availability_pap === null || editingEntity.availability_pap === undefined
            ? undefined
            : Boolean(editingEntity.availability_pap),
        address_complement: addressComplement,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editingEntity, form]);

  async function handleSubmit() {
    const values = await form.validateFields();

    if (isEditing && editingEntity) {
      const installationPreferredDateOne = dayjs.isDayjs(values.installation_preferred_date_one)
        ? values.installation_preferred_date_one.format("YYYY-MM-DD")
        : values.installation_preferred_date_one ?? null;
      const installationPreferredDateTwo = dayjs.isDayjs(values.installation_preferred_date_two)
        ? values.installation_preferred_date_two.format("YYYY-MM-DD")
        : values.installation_preferred_date_two ?? null;

      const normalizedAddressComplement = {
        lot: values.address_complement?.lot ?? null,
        block: values.address_complement?.block ?? null,
        floor: values.address_complement?.floor ?? null,
        square: values.address_complement?.square ?? null,
        unit_type: values.address_complement?.unit_type ?? null,
        unit_number: values.address_complement?.unit_number ?? null,
        home_complement: values.address_complement?.home_complement ?? null,
        reference_point: values.address_complement?.reference_point ?? null,
        building_or_house: values.address_complement?.building_or_house ?? "house",
      };

      updateMutation.mutate(
        {
          id: editingEntity.id,
          payload: {
            ...values,
            selected_extras: values.selected_extras ?? [],
            installation_preferred_date_one: installationPreferredDateOne,
            installation_preferred_date_two: installationPreferredDateTwo,
            cnpj: values.cnpj ?? null,
            due_day: values.due_day ?? null,
            address_complement: normalizedAddressComplement,
            address_floor: normalizedAddressComplement.floor,
            address_lot: normalizedAddressComplement.lot,
            address_block: normalizedAddressComplement.square,
            address_reference_point: normalizedAddressComplement.reference_point,
          },
        },
        { onSuccess: onClose },
      );
    }

  }
  return (
    <Modal
      open={open}
      title={
        isEditing ? `Editar ${entityPage.name}` : `Novo(a) ${entityPage.name}`
      }
      okText={isEditing ? "Salvar" : "Criar"}
      cancelText="Cancelar"
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={isPending}
      destroyOnHidden
      width={910}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-sm p-3">
          <div className="flex items-center">
            <h2 className="text-[14px] text-[#666666]">Detalhes dos Planos</h2>
          </div>

          <div className="mt-4 flex w-full flex-col text-neutral-700">
            <div className="flex items-center px-8 justify-between font-semibold text-[#666666] text-[14px]">
              <p className="w-72 text-center">Plano</p>
              <p className="w-28 text-center">Data Instalação 1</p>
              <p className="w-20 text-center">Período 1</p>
              <p className="w-28 text-center">Data Instalação 2</p>
              <p className="w-20 text-center">Período 2</p>
              <p className="w-20 text-center">Vencimento</p>
            </div>
            <hr className="border-t border-neutral-300" />

            <div className="flex px-8 items-center justify-between py-4 pb-0 text-[14px]">
              <div className="w-72 flex justify-center">
                <Form.Item name="plan_id" className="mb-0">
                  <Select
                    size="small"
                    showSearch
                    allowClear
                    placeholder="Selecione o plano"
                    className="min-w-72"
                    onChange={handlePlanChange}
                    options={planOptions}
                    optionFilterProp="label"
                    loading={isLoadingPlans}
                  />
                </Form.Item>
              </div>

              <div className="w-28 flex justify-center">
                <Form.Item
                  name="installation_preferred_date_one"
                  className="mb-0"
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Data 1"
                    className="min-w-28 text-center"
                    size="small"
                    allowClear
                  />
                </Form.Item>
              </div>

              <div className="w-20 flex justify-center">
                <Form.Item
                  name="installation_preferred_period_one"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    placeholder="Período 1"
                    className="min-w-22"
                    options={[
                      { label: "MANHÃ", value: "MANHA" },
                      { label: "TARDE", value: "TARDE" },
                      { label: "NOITE", value: "NOITE" },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="w-28 flex justify-center">
                <Form.Item
                  name="installation_preferred_date_two"
                  className="mb-0"
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Data 2"
                    className="min-w-28 text-center"
                    size="small"
                    allowClear
                  />
                </Form.Item>
              </div>

              <div className="w-20 flex justify-center">
                <Form.Item
                  name="installation_preferred_period_two"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    placeholder="Período 2"
                    className="min-w-22"
                    options={[
                      { label: "MANHÃ", value: "MANHA" },
                      { label: "TARDE", value: "TARDE" },
                      { label: "NOITE", value: "NOITE" },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="w-20 flex justify-center">
                <Form.Item name="due_day" className="mb-0">
                  <Select
                    size="small"
                    placeholder="Dia"
                    className="min-w-16"
                    showSearch
                    options={Array.from({ length: 31 }, (_, index) => ({
                      label: String(index + 1),
                      value: index + 1,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <hr className="border-t border-neutral-300 mx-2" />
          </div>

          {extrasOptions.length > 0 && (
            <div className="mt-4 bg-neutral-50 rounded-md p-4">
              <div className="font-semibold text-[#666666] text-[14px] mb-2">Extras disponíveis</div>
              <Form.Item name="selected_extras" className="mb-0">
                <Checkbox.Group style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {extrasOptions.map((extra, idx) => (
                    <Checkbox key={`${extra.id}-${idx}`} value={extra.id}>
                      <span className="font-medium text-sm">{extra.label}</span>
                      {extra.options && extra.options[0] && (
                        <>
                          {` R$${extra.options[0].price ?? ""} `}
                          <span className="text-xs text-neutral-600">{extra.options[0].description}</span>
                        </>
                      )}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </div>
          )}
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="availability_pap" label="Disponibilidade PAP">
              <Select
                allowClear
                placeholder="Selecione"
                options={[
                  { label: "Disponível", value: true },
                  { label: "Indisponível", value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Informações do Cliente
        </Typography.Title>
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
            <Form.Item
              name="cnpj"
              label="CNPJ"
              rules={[
                { min: 14, message: 'CNPJ deve ter 14 dígitos' },
                { max: 14, message: 'CNPJ deve ter 14 dígitos' },
              ]}
            >
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

        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Informações de Endereço
        </Typography.Title>
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

        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Observações
        </Typography.Title>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="consultant_observation" label="Observação do consultor">
              <Input.TextArea rows={3} placeholder="Digite observações internas" />
            </Form.Item>
          </Col>
        </Row>


      </Form>
    </Modal >
  );
}
