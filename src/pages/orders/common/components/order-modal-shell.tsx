import { Modal, type ModalProps } from "antd";
import type { ReactNode } from "react";

type OrderModalShellProps = Pick<
    ModalProps,
    | "open"
    | "title"
    | "okText"
    | "cancelText"
    | "onOk"
    | "onCancel"
    | "confirmLoading"
    | "destroyOnHidden"
    | "width"
    | "footer"
> & {
    children: ReactNode;
};

export function OrderModalShell({ children, ...modalProps }: OrderModalShellProps) {
    return <Modal {...modalProps}>{children}</Modal>;
}
