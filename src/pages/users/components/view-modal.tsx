import { Col, Modal, Row, Button, Typography } from "antd";
import { entityPage, type EntityType } from "../config-page.const";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { formatCNPJ, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatRoleLabel } from "@/utils/role.util";

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
                        <ReadonlyField
                            label="Hash"
                            value={viewingEntity?.consultant_hash} copyable
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Nome" value={viewingEntity?.user_name} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Email" value={viewingEntity?.email} copyable />
                    </Col>

                    <Col span={8}>
                        <ReadonlyField label="Telefone" value={formatPhoneNumber(viewingEntity?.telephone || "")} />
                    </Col>

                    <Col span={8}>
                        <ReadonlyField label="CPF" value={formatCPF(viewingEntity?.cpf || "")} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="CNPJ" value={formatCNPJ(viewingEntity?.cnpj || "")} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField
                            label="Nível de Acesso"
                            value={viewingEntity?.role ? formatRoleLabel(viewingEntity.role) : undefined}
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField
                            label="Empresa"
                            value={viewingEntity?.company?.company_name}
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Parceiro" value={viewingEntity?.partner?.partner_name} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField
                            label="Tipo"
                            value={viewingEntity?.user_type === "EQUIPE" ? "Equipe" : viewingEntity?.user_type === "SUBCREDENCIADO" ? "Subcredenciado" : "-"}
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField
                            label="Equipe"
                            value={viewingEntity?.team}
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField
                            label="Responsável"
                            value={viewingEntity?.person_responsible?.user_name || "-" + " - " + formatRoleLabel(viewingEntity?.person_responsible?.role ?? "")}
                        />
                    </Col>

                    <Col span={24}>
                        <div style={{ marginTop: 8 }}>
                            <Typography.Text type="secondary">Permissões de Notificação</Typography.Text>
                            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                                {viewingEntity?.allow_email_notifications && <li><CheckCircleOutlined /> Email</li>}
                                {viewingEntity?.allow_sms_notifications && <li><CheckCircleOutlined /> SMS</li>}
                                {viewingEntity?.allow_wpp_notifications && <li><CheckCircleOutlined /> WhatsApp</li>}
                                {(!viewingEntity?.allow_email_notifications && !viewingEntity?.allow_sms_notifications && !viewingEntity?.allow_wpp_notifications) && <li><CloseCircleOutlined /> Nenhum canal habilitado</li>}
                            </ul>
                        </div>
                    </Col>

                </Row>
            </div>
        </Modal>
    );
}