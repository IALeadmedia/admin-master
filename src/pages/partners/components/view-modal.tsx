import { Col, Modal, Row, Button, Typography, Space } from "antd";
import { entityPage, type EntityType } from "../config-page.const";
import ReadonlyField, { ArrayField } from "@/layout/common-components/ReadOnlyField";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCNPJ } from "@/utils/document.util";
import { formatCategoryLabel } from "@/utils/text.util";

interface ViewModalProps {
    open: boolean;
    viewingEntity: EntityType | null;
    onClose: () => void;
    onEdit?: (entity: EntityType) => void;
    onDelete?: (entity: EntityType) => void;
}

export function ViewModal({ open, viewingEntity, onClose, onEdit, onDelete }: ViewModalProps) {
    return (
        <Modal
            open={open}
            title={`Visualizar ${entityPage.name}`}
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                        Editar
                    </Button>
                    <Button danger onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                        Deletar
                    </Button>
                </div>
            }
            onCancel={onClose}
            destroyOnHidden
            width={910}
        >
            <div style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]} align="bottom">
                    <Col span={8}>
                        <Space orientation="vertical" size={4} style={{ display: "flex" }}>
                            {/* <Typography.Text type="secondary">Logo</Typography.Text> */}
                            <div
                                style={{
                                    minHeight: 30,
                                    padding: "4px 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {viewingEntity?.logo_url ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 64,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: 6,
                                            padding: 8,
                                        }}
                                    >
                                        <img
                                            src={viewingEntity.logo_url}
                                            alt="Logo"
                                            style={{
                                                maxHeight: 48,
                                                maxWidth: "100%",
                                                width: "auto",
                                                height: "auto",
                                                objectFit: "contain",
                                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Sem logo
                                    </Typography.Text>
                                )}
                            </div>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Nome" value={viewingEntity?.partner_name} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Identificador" value={viewingEntity?.partner_hash} copyable />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="CNPJ" value={formatCNPJ(viewingEntity?.cnpj ?? "")} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Email" value={viewingEntity?.email} copyable />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Telefone" value={formatPhoneNumber(viewingEntity?.telephone ?? "")} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Responsável" value={viewingEntity?.manager_name} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Empresa" value={viewingEntity?.company?.company_name} />
                    </Col>
                    <Col span={8}>
                        <ArrayField label="Tipo de Cliente" values={viewingEntity?.client_type} />
                    </Col>
                    <Col span={8}>
                        <ArrayField label="Estados de Cobertura" values={viewingEntity?.uf} />
                    </Col>
                    <Col span={8}>
                        <ArrayField
                            label="Categoria"
                            values={viewingEntity?.category?.map(formatCategoryLabel)}
                        />
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}