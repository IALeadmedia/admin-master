import { Modal, Typography } from "antd";
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation";

type DeleteableOrder = {
  id: string | number;
  order_number?: string | number | null;
};

interface DeleteConfirmModalProps {
  open: boolean;
  entitiesToDelete: DeleteableOrder[];
  onClose: () => void;
  entityLabel: string;
}

export function DeleteConfirmModal({
  open,
  entitiesToDelete,
  onClose,
  entityLabel,
}: DeleteConfirmModalProps) {
  const deleteMutation = useDeleteOrderMutation();

  function handleConfirm() {
    const ids = entitiesToDelete
      .map((entity) => Number(entity.id))
      .filter((id) => Number.isFinite(id));

    deleteMutation.mutate({ ids }, { onSuccess: onClose });
  }

  const isSingle = entitiesToDelete.length === 1;
  const firstLabel = entitiesToDelete[0]?.order_number ?? entitiesToDelete[0]?.id;

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
          Tem certeza que deseja deletar o(a) {entityLabel} <Typography.Text strong>{firstLabel}</Typography.Text>?
          Esta ação não pode ser desfeita.
        </Typography.Text>
      ) : (
        <Typography.Text>
          Tem certeza que deseja deletar <Typography.Text strong>{entitiesToDelete.length} {entityLabel}s</Typography.Text>?
          Esta ação não pode ser desfeita.
        </Typography.Text>
      )}
    </Modal>
  );
}
