import {
    Form,
    Input,
    Row,
    Col,
    Select,
    Button,
    Upload,
    Tooltip,
    Typography,
    Modal,
    Space,
    Empty,
    Spin,
    Popover,
} from "antd";
import InputTypeTooltipContent from "../../common/InputTypeTooltipContent";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";

function formatCurrencyPreview(value?: number) {
    if (typeof value !== "number") return "-";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export type ReusableExtraTemplate = {
    id: string;
    sourceProductId: number;
    sourceProductName: string;
    scope: "client" | "non_client";
    group: {
        id?: string;
        label?: string;
        description?: string;
        input_type?: "radio" | "checkbox" | "checkbox_group" | "select";
        images?: unknown[];
        options?: {
            id?: string;
            label?: string;
            price?: number;
            description?: string;
            bonus?: {
                type?: string;
                price?: number;
                speed?: number;
                description?: string;
            };
        }[];
    };
};

interface ExtrasGroupListProps {
    fieldName: "extras_non_client" | "extras_client";
    groupPlaceholder: string;
    bonusVisible: Record<string, boolean>;
    onToggleBonus: (key: string) => void;
    reusableTemplates?: ReusableExtraTemplate[];
    isLoadingReusableTemplates?: boolean;
    onApplyTemplate?: (
        fieldName: "extras_non_client" | "extras_client",
        groupIndex: number,
        group: ReusableExtraTemplate["group"],
    ) => void;
}

export function ExtrasGroupList({
    fieldName,
    groupPlaceholder,
    bonusVisible,
    onToggleBonus,
    reusableTemplates = [],
    isLoadingReusableTemplates = false,
    onApplyTemplate,
}: ExtrasGroupListProps) {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templateSearch, setTemplateSearch] = useState("");

    const scope = fieldName === "extras_client" ? "client" : "non_client";

    const templatesByScope = useMemo(
        () => reusableTemplates.filter((template) => template.scope === scope),
        [reusableTemplates, scope],
    );

    const filteredTemplates = useMemo(
        () =>
            templatesByScope.filter((template) =>
                `${template.sourceProductName} ${template.group.label ?? ""}`
                    .toLowerCase()
                    .includes(templateSearch.toLowerCase().trim()),
            ),
        [templateSearch, templatesByScope],
    );

    return (
        <Form.List name={fieldName}>
            {(groupFields, { add: addGroup, remove: removeGroup }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {groupFields.map(({ key, name, ...restField }) => (
                        <div
                            key={key}
                            style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}
                        >
                            {/* Header do grupo */}
                            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                <Typography.Text strong style={{ color: "#374151" }}>
                                    Grupo {name + 1}
                                </Typography.Text>
                                <Button type="text" danger size="small" onClick={() => removeGroup(name)}>
                                    Remover grupo
                                </Button>
                            </Row>

                            {/* Campos do grupo */}
                            <Row gutter={[8, 0]}>
                                <Col span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "input_type"]}
                                        label={
                                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                Tipo
                                                <Tooltip
                                                    title={<InputTypeTooltipContent />}
                                                    placement="top"
                                                    overlayStyle={{ fontSize: "12px" }}
                                                >
                                                    <span style={{ color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                                                        <ExclamationCircleOutlined />
                                                    </span>
                                                </Tooltip>
                                            </span>
                                        }
                                        rules={[{ required: true, message: "Tipo obrigatório" }]}
                                    >
                                        <Select placeholder="Selecione o tipo">
                                            <Select.Option value="radio">Radio</Select.Option>
                                            <Select.Option value="checkbox">Switch</Select.Option>
                                            <Select.Option value="checkbox_group">Grupo de Checkbox</Select.Option>
                                            <Select.Option value="select">Select</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "label"]}
                                        label="Título"
                                    >
                                        <Input placeholder={groupPlaceholder} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "description"]}
                                        label="Descrição"
                                    >
                                        <Input placeholder={groupPlaceholder} />
                                    </Form.Item>
                                </Col>
                            </Row>

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

                            {/* Opções */}
                            <Typography.Text strong style={{ display: "block", marginBottom: 8, color: "#374151" }}>
                                Opções
                            </Typography.Text>

                            <Form.List name={[name, "options"]}>
                                {(optionFields, { add: addOption, remove: removeOption }) => (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {optionFields.map(({ key: optionKey, name: optionName, ...optionRest }) => {
                                            const bonusKey = `${fieldName}_${name}_${optionName}`;
                                            const isBonusVisible = bonusVisible[bonusKey];
                                            return (
                                                <div
                                                    key={optionKey}
                                                    style={{
                                                        background: "#fff",
                                                        border: "1px solid #f3f4f6",
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                    }}
                                                >
                                                    {/* Linha principal da opção */}
                                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                        <Form.Item
                                                            {...optionRest}
                                                            name={[optionName, "label"]}
                                                            style={{ flex: 1, marginBottom: 0 }}
                                                            rules={[{ required: true, message: "Título obrigatório" }]}
                                                        >
                                                            <Input placeholder="Título" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...optionRest}
                                                            name={[optionName, "price"]}
                                                            style={{ width: 120, marginBottom: 0 }}
                                                        >
                                                            <Input inputMode="decimal" placeholder="Preço" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...optionRest}
                                                            name={[optionName, "description"]}
                                                            style={{ flex: 1, marginBottom: 0 }}
                                                        >
                                                            <Input placeholder="Descrição" />
                                                        </Form.Item>
                                                        <Button
                                                            danger
                                                            size="small"
                                                            onClick={() => removeOption(optionName)}
                                                            aria-label="Remover opção"
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>

                                                    {/* Toggle bônus */}
                                                    <div>
                                                        <Button
                                                            type={isBonusVisible ? "default" : "dashed"}
                                                            size="small"
                                                            onClick={() => onToggleBonus(bonusKey)}
                                                        >
                                                            {isBonusVisible ? "Ocultar bônus" : "Adicionar bônus"}
                                                        </Button>
                                                    </div>

                                                    {/* Campos de bônus */}
                                                    {isBonusVisible && (
                                                        <div
                                                            style={{
                                                                background: "#f9fafb",
                                                                border: "1px solid #e5e7eb",
                                                                borderRadius: 8,
                                                                padding: 12,
                                                                display: "flex",
                                                                gap: 8,
                                                                flexWrap: "wrap",
                                                            }}
                                                        >
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "bonus", "type"]}
                                                                label="Tipo do Bônus"
                                                                style={{ width: 180, marginBottom: 0 }}
                                                            >
                                                                <Input placeholder="Tipo do bônus" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "bonus", "speed"]}
                                                                label="Velocidade"
                                                                style={{ width: 120, marginBottom: 0 }}
                                                            >
                                                                <Input inputMode="numeric" placeholder="Velocidade" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "bonus", "description"]}
                                                                label="Descrição do Bônus"
                                                                style={{ flex: 1, minWidth: 140, marginBottom: 0 }}
                                                            >
                                                                <Input placeholder="Descrição" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "bonus", "price"]}
                                                                label="Preço do Bônus"
                                                                style={{ width: 120, marginBottom: 0 }}
                                                            >
                                                                <Input inputMode="decimal" placeholder="Preço" />
                                                            </Form.Item>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <Button type="dashed" onClick={() => addOption()} block>
                                            + Opção
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </div>
                    ))}

                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                        <Button type="dashed" onClick={() => addGroup()} block>
                            + Adicionar Grupo
                        </Button>
                        <Button
                            type="default"
                            onClick={() => setIsTemplateModalOpen(true)}
                            block
                        >
                            Reaproveitar Extra de Outro Produto
                        </Button>
                    </Space>

                    <Modal
                        open={isTemplateModalOpen}
                        title="Reaproveitar Extra"
                        onCancel={() => {
                            setIsTemplateModalOpen(false);
                            setTemplateSearch("");
                        }}
                        footer={null}
                        width={760}
                        destroyOnHidden
                    >
                        <Input.Search
                            placeholder="Buscar por produto ou título do extra"
                            value={templateSearch}
                            onChange={(event) => setTemplateSearch(event.target.value)}
                            allowClear
                            style={{ marginBottom: 16 }}
                        />

                        {isLoadingReusableTemplates ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                                <Spin />
                            </div>
                        ) : filteredTemplates.length === 0 ? (
                            <Empty description="Nenhum extra disponível para reaproveitar" />
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        style={{
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 8,
                                            padding: 12,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: 12,
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Typography.Text strong>
                                                {template.group.label || "Extra sem título"}
                                            </Typography.Text>
                                            <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                                                Produto: {template.sourceProductName}
                                            </Typography.Paragraph>
                                            <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                                                Tipo: {template.group.input_type || "-"} | Opções: {(template.group.options ?? []).length}
                                            </Typography.Paragraph>

                                            {(() => {
                                                const options = template.group.options ?? [];
                                                const bonusCount = options.filter((option) => {
                                                    const bonus = option.bonus;
                                                    return !!bonus && Object.values(bonus).some((value) => value != null && value !== "");
                                                }).length;

                                                if (!options.length) return null;

                                                return (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Typography.Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                                                            Prévia das opções {bonusCount > 0 ? `• ${bonusCount} com bônus` : ""}
                                                        </Typography.Text>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                            {options.slice(0, 2).map((option, index) => (
                                                                <div
                                                                    key={`${option.id ?? option.label ?? "option"}-${index}`}
                                                                    style={{
                                                                        background: "#fafafa",
                                                                        border: "1px solid #f3f4f6",
                                                                        borderRadius: 6,
                                                                        padding: "6px 8px",
                                                                    }}
                                                                >
                                                                    <Typography.Text style={{ display: "block", fontSize: 12 }}>
                                                                        {option.label || `Opção ${index + 1}`} • {formatCurrencyPreview(option.price)}
                                                                    </Typography.Text>
                                                                    {option.bonus && (
                                                                        <Typography.Text type="secondary" style={{ display: "block", fontSize: 11 }}>
                                                                            Bônus: {option.bonus.type || "-"}
                                                                            {typeof option.bonus.speed === "number" ? ` • ${option.bonus.speed} Mbps` : ""}
                                                                            {typeof option.bonus.price === "number" ? ` • ${formatCurrencyPreview(option.bonus.price)}` : ""}
                                                                        </Typography.Text>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {options.length > 2 && (
                                                                <Popover
                                                                    trigger="hover"
                                                                    placement="leftTop"
                                                                    title="Opções adicionais"
                                                                    content={
                                                                        <div style={{ maxWidth: 300, display: "flex", flexDirection: "column", gap: 6 }}>
                                                                            {options.slice(2).map((option, extraIndex) => (
                                                                                <div
                                                                                    key={`${option.id ?? option.label ?? "option"}-extra-${extraIndex}`}
                                                                                    style={{
                                                                                        border: "1px solid #f3f4f6",
                                                                                        borderRadius: 6,
                                                                                        padding: "6px 8px",
                                                                                        background: "#fff",
                                                                                    }}
                                                                                >
                                                                                    <Typography.Text style={{ display: "block", fontSize: 12 }}>
                                                                                        {option.label || `Opção ${extraIndex + 4}`} • {formatCurrencyPreview(option.price)}
                                                                                    </Typography.Text>
                                                                                    {option.bonus && (
                                                                                        <Typography.Text type="secondary" style={{ display: "block", fontSize: 11 }}>
                                                                                            Bônus: {option.bonus.type || "-"}
                                                                                        </Typography.Text>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    }
                                                                >
                                                                    <Typography.Text type="secondary" style={{ fontSize: 11, cursor: "pointer", textDecoration: "underline", width: "fit-content" }}>
                                                                        + {options.length - 2} opção(ões)
                                                                    </Typography.Text>
                                                                </Popover>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const nextGroupIndex = groupFields.length;
                                                addGroup(template.group);
                                                onApplyTemplate?.(fieldName, nextGroupIndex, template.group);
                                                setIsTemplateModalOpen(false);
                                                setTemplateSearch("");
                                            }}
                                        >
                                            Usar este Extra
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal>
                </div>
            )}
        </Form.List>
    );
}