import { useEffect, useState } from "react";
import { Form, Input, Modal, Row, Col, Upload, Button, Select, message, Dropdown, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  useCreateEntity,
  entityPage,
  useUpdateEntity,
  type EntityType,
  type FormValues,
} from "../config-page.const";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { UF_OPTIONS } from "@/utils/ufOptions";

interface FormModalProps {
  open: boolean;
  editingEntity: EntityType | null;
  onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const selectedUFs = (Form.useWatch("uf", form) ?? []) as string[];

  const isEditing = !!editingEntity;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const companies = useCompanyQuery().data?.companies.map((company) => ({
    label: company.company_name,
    value: company.company_id,
  })) ?? [];
  const isAllSelected = selectedUFs.length === UF_OPTIONS.length && UF_OPTIONS.length > 0;
  function handleUFChange(checkedValues: Array<string | number>) {
    form.setFieldValue("uf", checkedValues as string[]);
  }


  function handleSelectAll(event: CheckboxChangeEvent) {
    if (event.target.checked) {
      form.setFieldValue(
        "uf",
        UF_OPTIONS.map((option) => String(option.value)),
      );
      return;
    }

    form.setFieldValue("uf", []);
  }

  function handleClose() {
    setLogoFile(undefined);
    onClose();
  }

  useEffect(() => {
    if (open && editingEntity) {
      form.setFieldsValue({
        ...editingEntity,
        partner_id: editingEntity.partner_id ?? undefined,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editingEntity, form]);

  async function handleSubmit() {
    const values = await form.validateFields();
    if (!isEditing && !logoFile) {
      message.error("Informe o logo");
      return;
    }

    const { partner_id: _partnerId, ...payload } = values;
    void _partnerId;

    if (isEditing && editingEntity)
      updateMutation.mutate(
        {
          entity: {
            ...editingEntity,
            ...payload,
            partner_id: editingEntity.partner_id,
          },
          logoFile,
        },
        { onSuccess: handleClose },
      );
    else
      createMutation.mutate(
        {
          entity: {
            ...payload,
          },
          logoFile,
        },
        { onSuccess: handleClose },
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
      onCancel={handleClose}
      confirmLoading={isPending}
      destroyOnHidden
      width={910}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      // requiredMark="optional"
      >
        <Row gutter={16}>

          <Col span={8}>
            <Form.Item
              label="Logo"
            >
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
                onChange={({ fileList }) => {
                  setLogoFile(fileList[0]?.originFileObj as File | undefined);
                }}
              >
                <Button icon={<UploadOutlined />}>Adicionar logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="partner_name"
              label="Nome"
              rules={[
                { required: true, message: "Informe a razão social" },
              ]}
            >
              <Input placeholder="Informe a razão social" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="cnpj"
              label="CNPJ"
              rules={[{ required: true, message: "Informe o CNPJ" }, { min: 14, message: 'CNPJ deve ter 14 dígitos' },
              { max: 14, message: 'CNPJ deve ter 14 dígitos' },]}
            >
              <Input placeholder="00.000.000/0000-00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Informe o email" },
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
              rules={[{ required: true, message: "Informe o telefone" }, { min: 10, message: 'Telefone inválido' },
              { max: 11, message: 'Telefone inválido' },]}
            >
              <Input placeholder="(00) 00000-0000" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="manager_name"
              label="Responsável"
              rules={[{ required: true, message: "Informe o responsável" }]}
            >
              <Input placeholder="Informe o responsável" />
            </Form.Item>
          </Col>


        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="company_id"
              label="Empresa"
              rules={[{ required: true, message: "Informe a empresa" }]}
            >
              <Select placeholder="Selecione a empresa" options={companies} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="client_type"
              label="Tipo de Cliente"
              rules={[{ required: true, message: "Informe o tipo de cliente" }]}

            >

              <Select mode="multiple" placeholder="Selecione o tipo de cliente" options={[{ value: "PF", label: "PF" }, { value: "PJ", label: "PJ" }]} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="uf"
              label="UF"
              rules={[{ type: "array", required: true, min: 1, message: "Informe ao menos uma UF" }]}
            >
              <Dropdown
                popupRender={() => (
                  <div
                    style={{
                      width: 280,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      padding: 12,
                      maxHeight: 200,
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >

                    <div className="hide-scrollbar-uf">
                      <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" }}>
                        <Checkbox
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          style={{ fontWeight: 500 }}
                        >
                          Selecionar Todos
                        </Checkbox>
                      </div>
                      <Checkbox.Group
                        options={UF_OPTIONS}
                        value={selectedUFs}
                        onChange={handleUFChange}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      />
                    </div>
                  </div>
                )}
                trigger={["click"]}
              >
                <Button style={{ width: "100%" }}>
                  {selectedUFs.length ? `${selectedUFs.length} UF(s) selecionada(s)` : "Selecionar UF"} <DownOutlined />
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal >
  );
}
