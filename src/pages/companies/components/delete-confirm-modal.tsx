import { Modal, Typography } from "antd";
import type { ICompany } from "@/types/ICompany.type";
import { entityPage } from "../config-page.const";
import { useDeleteCompanyMutation } from "@/hooks/companies/useDeleteCompanyMutation";

interface DeleteConfirmModalProps {
    open: boolean;
    entitiesToDelete: ICompany[];
    onClose: () => void;
}

export function DeleteConfirmModal({
    open,
    entitiesToDelete,
    onClose,
}: DeleteConfirmModalProps) {
    const deleteMutation = useDeleteCompanyMutation();

    function handleConfirm() {
        const ids = entitiesToDelete.map((u) => u.company_id);
        deleteMutation.mutate({ ids }, { onSuccess: onClose });
        console.log("handleConfirm disparou", entitiesToDelete);
    }

    const isSingle = entitiesToDelete.length === 1;
    return (
        <Modal
            open={open}
            title="Confirmar exclusão"
            okText="Deletar"
            okButtonProps={{ danger: true }}
            cancelText="Cancelar"
            onOk={handleConfirm}
            onCancel={onClose}
            confirmLoading={deleteMutation.isPending}
        >
            {isSingle ? (
                <Typography.Text>
                    Tem certeza que deseja deletar o(a) {entityPage.name.toLowerCase()}{" "}
                    <Typography.Text strong>{entitiesToDelete[0]?.company_name}</Typography.Text>?
                    Esta ação não pode ser desfeita.
                </Typography.Text>
            ) : (
                <Typography.Text>
                    Tem certeza que deseja deletar{" "}
                    <Typography.Text strong>
                        {entitiesToDelete.length} {entityPage.name.toLowerCase()}s
                    </Typography.Text>
                    ? Esta ação não pode ser desfeita.
                </Typography.Text>
            )}
        </Modal>
    );
}
