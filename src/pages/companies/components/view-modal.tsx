import { Col, Modal, Row, Button } from "antd";
import { entityPage, type EntityType } from "../config-page.const";
import ReadonlyField, { ArrayField } from "@/layout/common-components/ReadOnlyField";
import { formatCNPJ } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatCategoryLabel } from "@/utils/text.util";

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
    return (
        <Modal
            open={open}
            title={`Visualizar ${entityPage.name}`}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button
                        type="primary"
                        onClick={() => viewingEntity && onEdit?.(viewingEntity)}
                    >
                        Editar
                    </Button>
                    <Button
                        danger
                        onClick={() => viewingEntity && onDelete?.(viewingEntity)}
                    >
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
                        <ReadonlyField label="Segmento" value={viewingEntity?.segment === "telecom" ? "Telecom" : viewingEntity?.segment === "finances" ? "Financeiro" : viewingEntity?.segment === "benefits" ? "Benefícios" : "-"} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Nome" value={viewingEntity?.company_name} />
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
                        <ReadonlyField
                            label="Responsável"
                            value={viewingEntity?.manager_name}
                        />
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