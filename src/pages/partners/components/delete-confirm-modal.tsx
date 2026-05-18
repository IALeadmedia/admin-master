import { Modal, Typography } from "antd";
import type { IPartner } from "@/types/IPartner.type";
import { entityPage } from "../config-page.const";
import { useDeletePartnerMutation } from "@/hooks/partners/useDeletePartnerMutation";

interface DeleteConfirmModalProps {
  open: boolean;
  entitiesToDelete: IPartner[];
  onClose: () => void;
}

export function DeleteConfirmModal({
  open,
  entitiesToDelete,
  onClose,
}: DeleteConfirmModalProps) {
  const deleteMutation = useDeletePartnerMutation();

  function handleConfirm() {
    const ids = entitiesToDelete.map((u) => u.partner_id);
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
          Tem certeza que deseja deletar o(a) {entityPage.name.toLowerCase()}{" "}
          <Typography.Text strong>{entitiesToDelete[0]?.partner_name}</Typography.Text>?
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
