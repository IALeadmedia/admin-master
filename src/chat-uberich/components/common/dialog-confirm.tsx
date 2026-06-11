import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface DialogConfirmProps {
  onConfirm: () => void;
  title: string;
  confirmText: string;
  children: React.ReactNode;
}

export const DialogConfirm = ({
  onConfirm,
  title,
  confirmText,
  children,
}: DialogConfirmProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogFooter>
          <Button
            variant="secondary"
            className="shadow-md hover:bg-slate-100"
            asChild
          >
            <DialogClose>Cancelar</DialogClose>
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="hover:bg-red-600 w-16"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
