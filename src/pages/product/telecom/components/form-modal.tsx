import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Button,
  Upload,
  Tooltip,
  Checkbox,
  ConfigProvider,
  Typography,
  Segmented,
} from "antd";
import ptBR from "antd/locale/pt_BR";
import {
  FilePdfOutlined,
  FileZipOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  entityPage,
  type EntityType,
} from "../config-page.const";
import { ExtrasGroupList } from "./form-extras";
import { useFormModal } from "@/hooks/products/userFormModal";
import { appSetting } from "@/constants/app-setting/config.const";
import { CoverageField } from "./form-coverage";


interface FormModalProps {
  open: boolean;
  editingEntity: EntityType | null;
  category: string;
  onClose: () => void;
}

type ExtrasTab = "non_client" | "client";

export function FormModal({ open, editingEntity, category, onClose }: FormModalProps) {
  const color = appSetting?.primaryColor;
  const {
    form,
    isEditing,
    isPending,
    isGlobalAdmin,
    companyOptions,
    selectedCompanyId,
    setSelectedCompanyId,
    reusableExtraTemplates,
    isLoadingReusableProducts,
    bonusVisible,
    handleToggleBonus,
    handleTemplateApplied,
    activeExtrasTab,
    setActiveExtrasTab,
    handleSubmit,
    handleClose,
  } = useFormModal({ open, editingEntity, category, onClose });

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
      width={940}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <div className="max-h-115 overflow-y-auto scrollbar-thin">

          {/* Empresa (Global Admin) */}
          {isGlobalAdmin && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Empresa"
                  required
                  validateStatus={selectedCompanyId == null ? "error" : ""}
                  help={selectedCompanyId == null ? "Selecione uma empresa" : undefined}
                >
                  <Select
                    placeholder="Selecione a empresa"
                    options={companyOptions}
                    value={selectedCompanyId}
                    onChange={setSelectedCompanyId}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Nome e Badge */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nome"
                rules={[{ required: true, message: "Nome do plano é obrigatório" }]}
              >
                <Input placeholder="Digite o nome do plano" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Informações adicionais" name="badge">
                <Input placeholder="Ex: Recomendado" />
              </Form.Item>
            </Col>
          </Row>

          {/* Oferta */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Título da Oferta"
                name="offer_title"
                rules={[{ required: true, message: "Título da oferta é obrigatório" }]}
              >
                <Input placeholder="Ex: Internet para jogar sem travar" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Subtítulo da Oferta" name="offer_subtitle">
                <Input placeholder="Ex: Mais velocidade, estabilidade e benefícios" />
              </Form.Item>
            </Col>
          </Row>

          {/* Tipo de Cliente e Condições */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tipo de Cliente"
                name="client_type"
                rules={[{ required: true, message: "Tipo de cliente é obrigatório" }]}
              >
                <Select placeholder="Selecione o tipo">
                  <Select.Option value="PF">Pessoa Física (PF)</Select.Option>
                  <Select.Option value="PJ">Pessoa Jurídica (PJ)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <>
                    Condições da Oferta (PDF ou ZIP)
                    <Tooltip
                      title="Arquivos com no máximo 10MB."
                      placement="top"
                      overlayInnerStyle={{ fontSize: "12px" }}
                    >
                      <span style={{ color: "#f87171", fontSize: 12, marginLeft: 4, cursor: "pointer" }}>
                        <ExclamationCircleOutlined />
                      </span>
                    </Tooltip>
                  </>
                }
                name="offer_conditions"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  beforeUpload={() => false}
                  multiple
                  accept=".pdf,.zip"
                  listType="text"
                  maxCount={5}
                  showUploadList={{ showRemoveIcon: true, showPreviewIcon: false, showDownloadIcon: false }}
                  iconRender={(file) => {
                    if (file.type === "application/pdf") return <FilePdfOutlined />;
                    if (file.type === "application/zip" || file.name.endsWith(".zip"))
                      return <FileZipOutlined />;
                    return <UploadOutlined />;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Selecionar Arquivos</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Cobertura */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Cobertura (UF / Cidades)"
                name="coverage"
                rules={[{ required: true, message: "Selecione ao menos uma UF de cobertura" }]}
              >
                <CoverageField />
              </Form.Item>
            </Col>
          </Row>

          {/* Preços */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Preço Inicial (R$)" name={["pricing", "base_monthly", "original_price"]}>
                <Input inputMode="decimal" placeholder="Ex: 369,99" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Preço Atual (R$)"
                name={["pricing", "base_monthly", "current_price"]}
                rules={[{ required: true, message: "Preço atual obrigatório" }]}
              >
                <Input inputMode="decimal" placeholder="Ex: 300,99" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Instalação (R$)" name={["pricing", "installation", "current_price"]}>
                <Input inputMode="decimal" placeholder="Ex: 49,90" />
              </Form.Item>
            </Col>
          </Row>

          {/* Características do Plano */}
          <div style={{ background: "#fafafa", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              Características do Plano
            </Typography.Title>

            <Form.List name="details">
              {(fields, { add, remove }) => (
                <Row gutter={[16, 0]}>
                  {fields.map(({ key, name, ...restField }) => (
                    <Col span={12} key={key}>
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          padding: 16,
                          marginBottom: 16,
                        }}
                      >
                        <Row justify="space-between" align="top" style={{ marginBottom: 12 }}>
                          <Typography.Text strong style={{ color: "#374151" }}>
                            Característica {name + 1}
                          </Typography.Text>
                          <Button type="text" danger size="small" onClick={() => remove(name)}>
                            Remover
                          </Button>
                        </Row>

                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          label="Título"
                          rules={[{ required: true, message: "Título é obrigatório" }]}
                        >
                          <Input placeholder="Ex: Velocidade" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          label="Descrição"
                        >
                          <Input placeholder="Ex: 100 Mbps de download" />
                        </Form.Item>

                        <ConfigProvider
                          locale={ptBR}
                          theme={{
                            components: {
                              Checkbox: {
                                colorPrimary: color,
                                colorPrimaryHover: color,
                                borderRadius: 4,
                                controlInteractiveSize: 18,
                                lineWidth: 2,
                              },
                            },
                          }}
                        >
                          <Row gutter={8}>
                            <Col>
                              <Form.Item
                                {...restField}
                                name={[name, "highlight_top"]}
                                valuePropName="checked"
                                initialValue={false}
                              >
                                <Checkbox>Selo Compacto</Checkbox>
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                {...restField}
                                name={[name, "highlight_bottom"]}
                                valuePropName="checked"
                                initialValue={false}
                              >
                                <Checkbox>Selo Destaque</Checkbox>
                              </Form.Item>
                            </Col>
                          </Row>
                        </ConfigProvider>

                        <Form.Item
                          {...restField}
                          name={[name, "images"]}
                          label="Imagens"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        >
                          <Upload
                            multiple
                            accept="image/*"
                            beforeUpload={() => false}
                            listType="picture-card"
                            showUploadList={{
                              showRemoveIcon: true,
                              showPreviewIcon: false,
                              showDownloadIcon: false,
                            }}
                            onPreview={(file) => {
                              if (file.url) window.open(file.url, "_blank");
                            }}
                          >
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          </Upload>
                        </Form.Item>
                      </div>
                    </Col>
                  ))}

                  <Col span={24}>
                    <Button type="dashed" onClick={() => add()} block style={{ marginBottom: 16 }}>
                      + Adicionar Característica
                    </Button>
                  </Col>
                </Row>
              )}
            </Form.List>
          </div>

          {/* Extras */}
          <div style={{ background: "#fafafa", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Extras
              </Typography.Title>
              <Tooltip
                title="Se este produto não tiver diferença entre as opções de extras para cliente e não cliente, preencha apenas o cenário de Não-clientes. Se houver diferença, preencha os dois cenários."
                placement="top"
                overlayStyle={{ fontSize: "12px" }}
              >
                <span style={{ color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                  <ExclamationCircleOutlined />
                </span>
              </Tooltip>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Segmented
                value={activeExtrasTab}
                onChange={(value) => setActiveExtrasTab(value as ExtrasTab)}
                options={[
                  { label: "Para Não-clientes", value: "non_client" },
                  { label: "Para Clientes", value: "client" },
                ]}
                style={{ width: "100%" }}
              />
            </div>

            {activeExtrasTab === "non_client" && (
              <ExtrasGroupList
                fieldName="extras_non_client"
                groupPlaceholder="Ex: Deixe seu pacote mais completo"
                bonusVisible={bonusVisible}
                onToggleBonus={handleToggleBonus}
                reusableTemplates={reusableExtraTemplates}
                isLoadingReusableTemplates={isLoadingReusableProducts}
                onApplyTemplate={handleTemplateApplied}
              />
            )}
            {activeExtrasTab === "client" && (
              <ExtrasGroupList
                fieldName="extras_client"
                groupPlaceholder="Ex: O dobro de canais"
                bonusVisible={bonusVisible}
                onToggleBonus={handleToggleBonus}
                reusableTemplates={reusableExtraTemplates}
                isLoadingReusableTemplates={isLoadingReusableProducts}
                onApplyTemplate={handleTemplateApplied}
              />
            )}
          </div>

        </div>
      </Form>
    </Modal>
  );
}