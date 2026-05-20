import { useEffect, useMemo } from "react";
import { Form, Input, Modal, Select, Row, Col, Checkbox, Typography } from "antd";
import {
  useCreateEntity,
  entityPage,
  useUpdateEntity,
  type EntityType,
  type FormValues,
  roleHierarchy,
  subCredenciadoRoleOptions,
  allRoleOptions,
} from "../config-page.const";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useUserQuery } from "@/hooks/users/useUserQuery";
import { useAuth } from "@/context/auth-provider";

interface FormModalProps {
  open: boolean;
  editingEntity: EntityType | null;
  onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();
  const { isGlobalAdmin } = useAuth();

  const isEditing = !!editingEntity;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const userType = Form.useWatch("user_type", form);
  const selectedRole = Form.useWatch("role", form);
  const selectedCompanyId = Form.useWatch("company_id", form);
  const selectedPartnerId = Form.useWatch("partner_id", form);

  const users = useUserQuery().data?.users;

  const supervisorOptions = useMemo(
    () => (users ?? [])
      .filter((user) => {
        if (selectedCompanyId == null) return false;

        const hasSameCompany = String(user.company_id) === String(selectedCompanyId);
        if (!hasSameCompany) return false;

        if (selectedPartnerId != null) {
          const hasSameOrNoPartner =
            String(user.partner_id) === String(selectedPartnerId) ||
            user.partner_id == null;
          if (!hasSameOrNoPartner) return false;
        }

        if (selectedRole) {
          const selectedRoleLevel = roleHierarchy[selectedRole] ?? Infinity;
          const userRoleLevel = roleHierarchy[user.role] ?? Infinity;
          return userRoleLevel < selectedRoleLevel;
        }

        return true;
      })
      .map((user) => ({
        label: `${user.user_name} - ${user.role}`,
        value: user.user_id,
      })),
    [users, selectedCompanyId, selectedPartnerId, selectedRole],
  );

  const companyOptions = useCompanyQuery({ enabled: isGlobalAdmin }).data?.companies.map((company) => ({
    label: company.company_name,
    value: company.company_id,
  })) ?? [];

  const partners = usePartnerQuery({ enabled: isGlobalAdmin }).data?.partners;

  const partnersByCompany = useMemo(
    () => (partners ?? []).filter(
      (partner) => String(partner.company_id) === String(selectedCompanyId),
    ),
    [partners, selectedCompanyId],
  );

  const partnerOptions = useMemo(
    () => partnersByCompany.map((partner) => ({
      label: partner.partner_name,
      value: partner.partner_id,
    })),
    [partnersByCompany],
  );

  const showPersonResponsible = ["GERENTE", "LIDER", "CONSULTOR"].includes(
    selectedRole ?? "",
  );

  useEffect(() => {
    if (open && editingEntity) {
      form.setFieldsValue({
        ...editingEntity,
        company_id: editingEntity.company_id ?? null,
        partner_id: editingEntity.partner_id ?? null,
        password: undefined,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editingEntity, form]);

  useEffect(() => {
    if (userType === "SUBCREDENCIADO") {
      const currentRole = form.getFieldValue("role");
      if (!["LIDER", "CONSULTOR"].includes(currentRole)) {
        form.setFieldValue("role", undefined);
      }
    }
  }, [userType, form]);

  useEffect(() => {
    if (!showPersonResponsible) {
      form.setFieldValue("person_responsible_id", undefined);
    }
  }, [showPersonResponsible, form]);

  useEffect(() => {
    const selectedPartnerId = form.getFieldValue("partner_id");
    if (!selectedPartnerId)
      return;

    const hasValidPartnerForCompany = partnersByCompany.some(
      (partner) =>
        String(partner.partner_id) === String(selectedPartnerId),
    );

    if (!hasValidPartnerForCompany) {
      form.setFieldValue("partner_id", undefined);
    }
  }, [partnersByCompany, form]);

  async function handleSubmit() {
    const values = await form.validateFields();

    if (isEditing && editingEntity)
      updateMutation.mutate(
        {
          ...editingEntity,
          ...values,
          allow_email_notifications: values.allow_email_notifications ?? false,
          allow_sms_notifications: values.allow_sms_notifications ?? false,
          allow_wpp_notifications: values.allow_wpp_notifications ?? false,
          company_id: values.company_id ?? null,
          partner_id: values.partner_id ?? null,
          ...(values.password ? { password: values.password } : {}),
        },
        { onSuccess: onClose },
      );
    else
      createMutation.mutate(
        {
          ...values,
          company_id: values.company_id ?? 0,
          allow_email_notifications: values.allow_email_notifications ?? false,
          allow_sms_notifications: values.allow_sms_notifications ?? false,
          allow_wpp_notifications: values.allow_wpp_notifications ?? false,
          partner_id: values.partner_id ?? 0,
          person_responsible_id: values.person_responsible_id ?? null,
          password: values.password!,
          user_type: values.user_type ?? "",
          team: values.team ?? "",
          cnpj: values.cnpj ?? "",
          user_name: values.user_name,
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
              name="user_type"
              label="Tipo de Usuário"
              rules={[{ required: true, message: "Selecione o tipo de usuário" }]}
            >
              <Select
                placeholder="Selecione..."
                options={[
                  { label: "Equipe", value: "EQUIPE" },
                  { label: "Subcredenciado", value: "SUBCREDENCIADO" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="email"
              label="Email (login)"
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
              name="password"
              label="Senha"
              rules={[{ required: !isEditing, message: "Informe a senha" }]}
            >
              <Input.Password
                placeholder={
                  isEditing
                    ? "Deixe em branco para manter a senha"
                    : "Digite a senha"
                }
              />
            </Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="user_name"
              label="Nome"
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input placeholder="Nome completo" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="telephone"
              label="Telefone"

            >
              <Input placeholder="(00) 00000-0000" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="cpf"
              label="CPF"

            >
              <Input placeholder="000.000.000-00" />
            </Form.Item>
          </Col>





        </Row>

        <Row gutter={16}>
          {isGlobalAdmin && (
            <Col span={8}>
              <Form.Item name="company_id" label="Empresa" rules={[{ required: true, message: "Selecione a empresa" }]}>
                <Select
                  placeholder="Selecione..."
                  options={companyOptions}
                />
              </Form.Item>
            </Col>
          )}
          {isGlobalAdmin && (
            <Col span={8}>
              <Form.Item name="partner_id" label="Parceiro">
                <Select
                  placeholder={selectedCompanyId ? "Selecione..." : "Selecione uma empresa primeiro"}
                  options={partnerOptions}
                  disabled={!selectedCompanyId}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item
              name="role"
              label="Nível de Acesso"
              rules={[{ required: true, message: "Selecione o papel" }]}
            >
              <Select
                placeholder="Selecione..."
                options={
                  userType === "SUBCREDENCIADO"
                    ? subCredenciadoRoleOptions
                    : allRoleOptions
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {showPersonResponsible && (
            <Col span={8} >
              <Form.Item

                name="person_responsible_id"
                label="Responsável"
                rules={[{ required: true, message: "Selecione o responsável" }]}
              >
                <Select
                  placeholder="Selecione..."
                  options={supervisorOptions}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Typography>Permissões de Notificação</Typography>

            <div className="flex gap-2">
              <Form.Item
                name="allow_email_notifications"
                valuePropName="checked"
              >
                <Row>
                  <Col span={12}>
                    <Checkbox>Email</Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="allow_sms_notifications"
                valuePropName="checked"
              >
                <Row>
                  <Col span={12}>
                    <Checkbox>SMS</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="allow_wpp_notifications"
                valuePropName="checked"
              >
                <Row>
                  <Col span={12}>
                    <Checkbox>WhatsApp</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
            </div>
          </Col>
          {userType === "EQUIPE" && (
            <Col span={8}>
              <Form.Item
                name="team"
                label="Equipe"
                rules={[{ required: true, message: "Informe a equipe" }]}
              >
                <Input placeholder="Nome da equipe" />
              </Form.Item>
            </Col>
          )}
          {userType === "SUBCREDENCIADO" && (
            <Col span={8}>
              <Form.Item

                name="cnpj"
                label="CNPJ"
                rules={[{ required: true, message: "Informe o CNPJ" }]}
              >
                <Input placeholder="00.000.000/0000-00" />
              </Form.Item>
            </Col>
          )}
        </Row>


      </Form>
    </Modal >
  );
}
