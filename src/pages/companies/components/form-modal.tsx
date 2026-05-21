import { useEffect } from "react";
import { Form, Input, Modal, Row, Col, Select, } from "antd";
import {
  useCreateEntity,
  entityPage,
  useUpdateEntity,
  type EntityType,
  type FormValues,
} from "../config-page.const";
import { PatternFormat, type PatternFormatProps } from "react-number-format";

interface FormModalProps {
  open: boolean;
  editingEntity: EntityType | null;
  onClose: () => void;
}
const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    className="h-8"
  />
);
const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="(##) ####-####"
    customInput={Input}
    placeholder="Telefone"
    size="middle"
    className="h-8"
  />
);
export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();

  const isEditing = !!editingEntity;
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open && editingEntity) {
      form.setFieldsValue({
        ...editingEntity,
        company_id: editingEntity.company_id ?? undefined,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editingEntity, form]);

  async function handleSubmit() {
    const values = await form.validateFields();
    const cleanValues = {
      ...values,
      cnpj: values.cnpj?.replace(/\D/g, ""),
      telephone: values.telephone?.replace(/\D/g, ""),
    };
    if (isEditing && editingEntity)
      updateMutation.mutate(
        {
          ...editingEntity,
          ...cleanValues,
          company_id: editingEntity.company_id,

        },
        { onSuccess: onClose },
      );
    else
      createMutation.mutate(
        {
          ...cleanValues,
          company_id: values.company_id ?? null,
        },
        { onSuccess: onClose },
      );
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
      width={920}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}

      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="segment"
              label="Segmento"
              rules={[
                { required: true, message: "Informe o segmento" },
              ]}
            >
              <Select
                placeholder="Selecione..."
                options={[
                  { label: "Financeiro", value: "finances" },
                  { label: "Telecom", value: "telecom" },
                  { label: "Benefícios", value: "benefits" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="company_name"
              label="Nome"
              rules={[
                { required: true, message: "Informe o nome da empresa" },
              ]}
            >
              <Input placeholder="Informe o nome da empresa" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="cnpj"
              label="CNPJ"
            >
              <CNPJInput format="##.###.###/####-##" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input placeholder="exemplo@email.com" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="telephone"
              label="Telefone"
            >
              <PhoneInput format="(##) #####-####" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="manager_name"
              label="Responsável"

            >
              <Input placeholder="Informe o responsável" />
            </Form.Item>
          </Col>

        </Row>
        <Col span={8}>
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: "Informe a categoria" }]}
          >
            <Select mode="multiple" placeholder="Selecione a categoria" options={[{ value: "banda-larga", label: "Banda Larga" }, { value: "telefonia-movel", label: "Telefonia Móvel" }]} />
          </Form.Item>
        </Col>
      </Form>
    </Modal >
  );
}
