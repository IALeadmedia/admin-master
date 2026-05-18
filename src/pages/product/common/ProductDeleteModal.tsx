import { Modal, Typography } from "antd";
import type { IProduct } from "@/types/IProduct.type";

interface DeleteMutation {
    mutate: (payload: { ids: number[] }, opts: { onSuccess: () => void }) => void;
    isPending: boolean;
}

interface ProductDeleteModalProps {
    open: boolean;
    entitiesToDelete: IProduct[];
    entityName: string;
    entityPlural: string;
    onClose: () => void;
    deleteMutation: DeleteMutation;
}

export function ProductDeleteModal({
    open,
    entitiesToDelete,
    entityName,
    entityPlural,
    onClose,
    deleteMutation,
}: ProductDeleteModalProps) {
    function handleConfirm() {
        const ids = entitiesToDelete.map((e) => e.id);
        deleteMutation.mutate({ ids }, { onSuccess: onClose });
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
                    Tem certeza que deseja deletar o(a) {entityName.toLowerCase()}{" "}
                    <Typography.Text strong>{entitiesToDelete[0]?.name}</Typography.Text>?
                    Esta ação não pode ser desfeita.
                </Typography.Text>
            ) : (
                <Typography.Text>
                    Tem certeza que deseja deletar{" "}
                    <Typography.Text strong>
                        {entitiesToDelete.length} {entityPlural.toLowerCase()}
                    </Typography.Text>
                    ? Esta ação não pode ser desfeita.
                </Typography.Text>
            )}
        </Modal>
    );
}
