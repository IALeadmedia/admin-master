import { Modal, Button, Typography } from "antd";
import { entityPage, type EntityType } from "../config-page.const";

import { appSetting } from "@/constants/app-setting/config.const";
import { WifiOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";

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
    if (!viewingEntity) return null;
    const { user } = useAuth();
    const canEdit = can(user?.user?.role, "products", "edit");
    const canDelete = can(user?.user?.role, "products", "delete");
    const color = appSetting?.primaryColor
    return (
        <Modal
            open={open}
            title={`Visualizar ${entityPage.name}`}
            footer={
                canEdit || canDelete ? (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        {canEdit && (
                            <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                                Editar
                            </Button>
                        )}
                        {canDelete && (
                            <Button danger onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                                Deletar
                            </Button>
                        )}
                    </div>
                ) : null
            }
            onCancel={onClose}
            destroyOnHidden
            width={600}
        >
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


                </div>




            </div>
        </Modal>
    );
}
