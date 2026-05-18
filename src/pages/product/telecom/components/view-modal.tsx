import { Modal, Button, Row, Col, Typography, Space } from "antd";
import { WifiOutlined, DownloadOutlined } from "@ant-design/icons";
import { entityPage, type EntityType } from "../config-page.const";
import { appSetting } from "@/constants/app-setting/config.const";
import { formatBRL } from "@/utils/number.utils";
import { ExtraSection } from "./view-extras-info";
import { resolveImageUrl } from "@/utils/products.utils";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";

type ProductOfferConditionFile = { url: string; type: string };
type ProductDetail = EntityType["details"][number];

interface ViewModalProps {
    open: boolean;
    viewingEntity: EntityType | null;
    onClose: () => void;
    onEdit?: (entity: EntityType) => void;
    onDelete?: (entity: EntityType) => void;
}

export function ViewModal({
    open,
    viewingEntity,
    onClose,
    onEdit,
    onDelete,
}: ViewModalProps) {
    const { user } = useAuth();
    const canEdit = can(user?.user?.role, "products", "edit");
    const canDelete = can(user?.user?.role, "products", "delete");
    const color = appSetting?.primaryColor

    const clientExtras = viewingEntity?.extras?.client ?? [];
    const nonClientExtras = viewingEntity?.extras?.non_client ?? [];
    const hasExtras = clientExtras.length > 0 || nonClientExtras.length > 0;

    return (
        <Modal
            open={open}
            title={`Visualizar ${entityPage.name}`}
            footer={
                canEdit || canDelete ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        {canEdit && (
                            <Button
                                type="primary"
                                onClick={() => viewingEntity && onEdit?.(viewingEntity)}
                            >
                                Editar
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                danger
                                onClick={() => viewingEntity && onDelete?.(viewingEntity)}
                            >
                                Deletar
                            </Button>
                        )}
                    </div>
                ) : null
            }
            onCancel={onClose}
            destroyOnHidden
            width={940}
        >
            <div>


                <div className="max-h-130 overflow-y-auto scrollbar-thin">

                    {/* Header do Plano */}
                    <div style={{ background: "#f5f5f5", padding: 24, borderRadius: 8, marginBottom: 24 }}>
                        {viewingEntity?.badge && (
                            <div style={{ marginBottom: 8 }}>
                                <Typography.Text strong style={{ color: "#374151" }}>
                                    {viewingEntity.badge}
                                </Typography.Text>
                            </div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                            <Typography.Title level={4} style={{ marginBottom: 8 }}>
                                {viewingEntity?.name} - {viewingEntity?.client_type}
                            </Typography.Title>

                        </div>

                        {(viewingEntity?.offer_title || viewingEntity?.offer_subtitle) && (
                            <div style={{ marginBottom: 16 }}>
                                {viewingEntity?.offer_title && (
                                    <Typography.Title level={5} style={{ marginBottom: 4 }}>
                                        <WifiOutlined style={{ color: color, marginRight: 8 }} />
                                        {viewingEntity.offer_title}
                                    </Typography.Title>
                                )}
                                {viewingEntity?.offer_subtitle && (
                                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                                        {viewingEntity.offer_subtitle}
                                    </Typography.Text>
                                )}
                            </div>
                        )}

                        {viewingEntity?.offer_conditions && viewingEntity.offer_conditions.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <Space wrap size={8}>
                                    {viewingEntity.offer_conditions.map(
                                        (condition: ProductOfferConditionFile | string, idx: number) => {
                                            const conditionUrl =
                                                typeof condition === "string" ? condition : condition?.url;
                                            if (!conditionUrl) return null;
                                            const fileName = conditionUrl.split("/").pop() || `arquivo_${idx + 1}`;
                                            const ext = fileName.split(".").pop()?.toLowerCase();
                                            return (
                                                <a
                                                    key={idx}
                                                    href={conditionUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={fileName}
                                                    style={{ color: color, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                                                >
                                                    <DownloadOutlined />
                                                    <span style={{ textDecoration: "underline" }}>{fileName}</span>
                                                    {typeof condition !== "string" && condition?.type
                                                        ? ` (${condition.type})`
                                                        : ext ? ` (${ext})` : ""}
                                                </a>
                                            );
                                        },
                                    )}
                                </Space>
                            </div>
                        )}
                    </div>

                    {/* Preços */}
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24,
                        }}
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8} style={{ display: "flex", flexDirection: "column" }}>
                                <Typography.Text type="secondary" style={{ fontSize: 13, marginBottom: 4 }}>
                                    Preço Inicial
                                </Typography.Text>
                                <Typography.Text strong style={{ fontSize: 22, color: "#404040" }}>
                                    {formatBRL(viewingEntity?.pricing?.base_monthly?.original_price)}
                                </Typography.Text>
                            </Col>
                            <Col xs={24} md={8} style={{ display: "flex", flexDirection: "column" }}>
                                <Typography.Text type="secondary" style={{ fontSize: 13, marginBottom: 4 }}>
                                    Preço Atual
                                </Typography.Text>
                                <span style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                                    <Typography.Text strong style={{ fontSize: 28, color: "#404040" }}>
                                        {formatBRL(viewingEntity?.pricing?.base_monthly?.current_price)}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 13, marginBottom: 4 }}>
                                        /mês
                                    </Typography.Text>
                                </span>
                            </Col>
                            {(viewingEntity?.pricing?.installation?.current_price ?? -1) >= 0 && (
                                <Col xs={24} md={8} style={{ display: "flex", flexDirection: "column" }}>
                                    <Typography.Text type="secondary" style={{ fontSize: 13, marginBottom: 4 }}>
                                        Instalação
                                    </Typography.Text>
                                    <Typography.Text strong style={{ fontSize: 22, color: "#404040" }}>
                                        {formatBRL(viewingEntity?.pricing?.installation?.current_price)}
                                    </Typography.Text>
                                </Col>
                            )}
                        </Row>
                    </div>

                    {/* Características do Plano */}
                    {viewingEntity?.details && viewingEntity.details.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <Typography.Title level={5} style={{ marginBottom: 16 }}>
                                Características do Plano
                            </Typography.Title>
                            <Row gutter={[16, 16]}>
                                {viewingEntity.details.map((detail: ProductDetail, index: number) => (
                                    <Col xs={24} md={12} lg={8} key={index}>
                                        <div
                                            style={{
                                                background: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 8,
                                                padding: 16,
                                                height: "100%",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                <Typography.Text strong style={{ flex: 1 }}>
                                                    {detail.title}
                                                </Typography.Text>
                                                <Space direction="vertical" size={4} style={{ marginLeft: 8, width: 64 }}>
                                                    {detail.highlight_top && (
                                                        <span
                                                            style={{
                                                                display: "block",
                                                                fontSize: 10,
                                                                textAlign: "center",
                                                                borderRadius: 4,
                                                                background: color,
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                            }}
                                                        >
                                                            Compacto
                                                        </span>
                                                    )}
                                                    {detail.highlight_bottom && (
                                                        <span
                                                            style={{
                                                                display: "block",
                                                                fontSize: 10,
                                                                textAlign: "center",
                                                                borderRadius: 4,
                                                                background: color,
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                            }}
                                                        >
                                                            Destaque
                                                        </span>
                                                    )}
                                                </Space>
                                            </div>

                                            <Typography.Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                                                {detail.description}
                                            </Typography.Text>

                                            {Array.isArray(detail.images) && detail.images.length > 0 && (
                                                <Space wrap size={8} style={{ marginTop: 8 }}>
                                                    {detail.images.map((imageItem: unknown, idx: number) => {
                                                        const imgUrl = resolveImageUrl(imageItem);
                                                        if (!imgUrl) return null;
                                                        const imgName = imgUrl.split("/").pop() || `imagem_${idx + 1}`;
                                                        return (
                                                            <a
                                                                key={idx}
                                                                href={imgUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download={imgName}
                                                                style={{ color: color, display: "flex", flexDirection: "column", alignItems: "center" }}
                                                            >
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={imgName}
                                                                    style={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        objectFit: "cover",
                                                                        borderRadius: 4,
                                                                        border: "1px solid #e5e7eb",
                                                                        marginBottom: 4,
                                                                    }}
                                                                />
                                                            </a>
                                                        );
                                                    })}
                                                </Space>
                                            )}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Extras */}
                    {hasExtras && (
                        <div style={{ marginBottom: 24 }}>
                            <Typography.Title level={5} style={{ marginBottom: 16 }}>
                                Extras
                            </Typography.Title>

                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <ExtraSection title="Cliente" groups={clientExtras} color={color} />
                                <ExtraSection title="Não Cliente" groups={nonClientExtras} color={color} />
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </Modal>
    );
}