import { Col, Modal, Row, Button, Typography, Space } from "antd";
import { entityPage, type EntityType } from "../config-page.const";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCNPJ } from "@/utils/document.util";

interface ViewModalProps {
    open: boolean;
    viewingEntity: EntityType | null;
    onClose: () => void;
    onEdit?: (entity: EntityType) => void;
    onDelete?: (entity: EntityType) => void;
}

function ArrayField({ label, values }: { label: string; values?: string[] }) {
    return (
        <Space orientation="vertical" size={4} style={{ display: "flex" }}>
            <Typography.Text type="secondary">{label}</Typography.Text>
            <div
                style={{
                    minHeight: 30,
                    padding: "4px 10px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.015)",
                }}
            >
                {values?.length ? values.join(", ") : "-"}
            </div>
        </Space>
    );
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
                <Row gutter={[16, 16]}>
                    <Col span={8}>

                        <Space orientation="vertical" size={4} style={{ display: "flex" }}>
                            <Typography.Text type="secondary">Logo</Typography.Text>
                            <div
                                style={{
                                    minHeight: 30,
                                    padding: "4px 10px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: 8,
                                    backgroundColor: "rgba(0, 0, 0, 0.015)",
                                }}
                            >
                                <img src={viewingEntity?.logo_url ?? ""} alt="Logo" className="h-6" />

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
                        <ReadonlyField label="Email" value={viewingEntity?.email} />
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
                </Row>
            </div>
        </Modal>
    );
}