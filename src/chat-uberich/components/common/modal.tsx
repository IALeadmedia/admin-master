import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: any) => !open && onClose()}>
      <DialogOverlay />
      <DialogContent className="rounded-lg border items-center flex flex-col w-fit max-w-[80vdw] overflow-y-auto">
        {title && (
          <DialogTitle className="text-lg font-bold mb-4">{title}</DialogTitle>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
